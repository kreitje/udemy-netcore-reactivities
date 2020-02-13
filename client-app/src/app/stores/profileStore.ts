import {RootStore} from './rootStore';
import {observable, action, runInAction, computed} from 'mobx';
import {IPhoto, IProfile} from '../models/profile';
import agent from '../api/agent';
import {toast} from 'react-toastify';

export default class ProfileStore {
    rootStore: RootStore;
    
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }
    
    @observable profile: IProfile | null = null;
    @observable loadingProfile = true;
    @observable uploadingPhoto = false;
    @observable loading = false;
    
    @computed get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        }
        return false;
    }
    
    @action loadProfile = async (username: string) => {
        this.loadingProfile = true;
        
        try {
            const profile = await agent.Profiles.get(username);
            
            runInAction('load profile', () => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (error) {
            console.log(error);
            runInAction('load profile error', () => {
                this.loadingProfile = false;
            });
        }
    }
    
    @action uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        
        try {
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction('upload photo', () => {
                if (this.profile) {
                    this.profile.photos.push(photo);
                    if (photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }
                this.uploadingPhoto = false;
            });
        } catch (error) {
            console.log(error);
            toast.error('Problem uploading photo');
            runInAction('upload photo error', () => {
                this.uploadingPhoto = false;
            })
        }
    }
    
    @action setMainPhoto = async (photo: IPhoto) => {
        this.loading = true;
        
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction('Set Main', () => {
                this.loading = false;
                
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(a => a.isMain)!.isMain = false;
                this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
            })
            
        } catch (error) {
            console.log(error);
            toast.error('Problem setting main image');
            runInAction('Set Main error', () => {
                this.loading = false;
            })
        }
    }
    
    @action deletePhoto = async (photo: IPhoto) => {
        this.loading = true;

        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction('Delete photo', () => {
                this.loading = false;
                this.profile!.photos = this.profile!.photos.filter(a => a.id !== photo.id);
            })

        } catch (error) {
            console.log(error);
            toast.error('Problem deleting image');
            runInAction('Delete photo error', () => {
                this.loading = false;
            })
        }
    }
}