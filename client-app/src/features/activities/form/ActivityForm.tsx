import React, {useState, FormEvent, useContext} from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { v4 as uuid } from 'uuid'
import {observer} from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';

interface IProps {
    activity: IActivity | null | undefined;
}

const ActivityForm : React.FC<IProps> = ({ 
    activity: initialFormState,
}) => {
    const activityStore = useContext(ActivityStore);
    const {createActivity, editActivity, cancelFormOpen, submitting} = activityStore;

    const initalizeForm = () => {
        if (initialFormState) {
            return initialFormState;
        }

        return {
            id: '',
            title: '',
            category: '',
            description: '',
            date: '',
            city: '',
            venue: ''
        }
    };

    const [activity, setActivity] = useState<IActivity>(initalizeForm);

    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }

            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value});
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input placeholder='Title' name='title' value={activity.title} onChange={handleInputChange} />
                <Form.TextArea placeholder='Description' name='description' value={activity.description} onChange={handleInputChange} />
                <Form.Input placeholder='Category' name='category' value={activity.category} onChange={handleInputChange} />
                <Form.Input type='datetime-local' placeholder='Date' name='date' value={activity.date} onChange={handleInputChange} />
                <Form.Input placeholder='City' name='city' value={activity.city} onChange={handleInputChange} />
                <Form.Input placeholder='Venue' name='venue' value={activity.venue} onChange={handleInputChange} />
                <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
                <Button floated='right' type='button' content='Cancel' onClick={cancelFormOpen} />
            </Form>
        </Segment>
    )
}

export default observer(ActivityForm);