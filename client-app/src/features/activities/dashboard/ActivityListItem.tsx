import React from 'react'
import { Item, Button, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IActivity } from '../../../app/models/activity';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';

const ActivityListItem : React.FC<{activity: IActivity}> = ({activity}) => {

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item key={activity.id}>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Description>
                                Hosted By Bob
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> {activity.date}
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                Attendees will go here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button
                    floated='right'
                    content='View'
                    color='blue'
                    as={Link}
                    to={`/activities/${activity.id}`}
                />
            </Segment>
        </Segment.Group>
    )
}

export default ActivityListItem;