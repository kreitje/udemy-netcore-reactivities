import {observable, action, computed, runInAction} from 'mobx';
import {SyntheticEvent} from 'react';
import {IActivity} from '../models/activity';
import agent from '../api/agent';
import { history } from '../../';
import {toast} from 'react-toastify';
import {RootStore} from './rootStore';
import {createAttendee, setActivityProps} from '../common/util/util';

export default class ActivityStore {
    rootStore: RootStore;
    
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }
    
    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';
    @observable loading = false;
    
    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    };
    
    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        );
        
        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as {[key: string]: IActivity[]}));
    }
    
    @action loadActivities = async () => {
        this.loadingInitial = true;

        try {
            const activities = await agent.Activities.list();
            runInAction('loading activities', () => {
                activities.forEach(activity => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activityRegistry.set(activity.id, activity);
                });

                this.loadingInitial = false;
            });
        } catch (error) {
            runInAction('loading activities error', () => {
                console.log(error);
                this.loadingInitial = false;
            })
        }
    };
    
    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('load activity', () => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                })
                return activity;
            } catch (error) {
                runInAction('load activity error', () => {
                    this.loadingInitial = false;
                });
            }
        }
    };
    
    @action clearActivity = () => {
        this.activity = null;
    };
    
    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    };
    
    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        
        try {
            await agent.Activities.create(activity);

            //add the current user as the host
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.isHost = true;
            
            runInAction('creating activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            });

            history.push(`/activities/${activity.id}`);
        } catch (error) {
            runInAction('creating activity error', () => {
                console.log(error);
                toast.error('Problem submitting data');
                this.submitting = false;
            })
        }
    };
    
    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        
        try {
            await agent.Activities.update(activity);
            
            runInAction('editing activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            })

            history.push(`/activities/${activity.id}`);
        } catch (error) {
            runInAction('editing activity error', () => {
                console.log(error);
                toast.error('Problem submitting data');
                this.submitting = false;
            });
        }
    };
    
    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        
        try {
            await agent.Activities.delete(id);
            
            runInAction('deleting activity', () => {
                this.activityRegistry.delete(id);
                this.submitting = false;
            });
        } catch (error) {
            runInAction('deleting activity error', () => {
                console.log(error);
                this.submitting = false;
            });
        }
    };
    
    @action attendActivity = async () => {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;
        
        try {
            await agent.Activities.attend(this.activity!.id);
            runInAction('attend activity', () => {
                if (this.activity) {
                    this.activity.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction('attend activity error', () => {
                this.loading = false;
            });
            toast.error('Problem attending activity')
        }
    };
    
    @action cancelAttendance = async () => {
        this.loading = true;
        try {
            await agent.Activities.unattend(this.activity!.id);
            runInAction('unattend activity', () => {
                if (this.activity) {
                    this.activity.attendees = this.activity.attendees.filter(
                        x => x.username !== this.rootStore.userStore.user!.username
                    );

                    this.activity.isGoing = false;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction('unattend activity error', () => {
                this.loading = false;
            });
            toast.error('Problem cancelling attendance');
        }
    }
}