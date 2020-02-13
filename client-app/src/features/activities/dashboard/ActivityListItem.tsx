import React from 'react'
import {Item, Button, Segment, Label} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IActivity } from '../../../app/models/activity';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import {format} from 'date-fns';
import ActivityListItemAttendees from './ActivityListItemAttendees';

const ActivityListItem : React.FC<{activity: IActivity}> = ({activity}) => {
    const host = activity.attendees.filter(x => x.isHost)[0];
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item key={activity.id}>
                        <Item.Image size='tiny' circular src={host.image || '/assets/user.png'} style={{marginBottom: 3}} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
                            <Item.Description>
                                Hosted By <Link to={`/profile/${host.username}`}>{host.displayName}</Link>
                            </Item.Description>
                            {activity.isHost && (
                                <Item.Description>
                                    <Label basic color='orange' content='You are hosting this activity' />
                                </Item.Description>
                            )}
                            {activity.isGoing && !activity.isHost && (
                                <Item.Description>
                                    <Label basic color='green' content='You are going to this activity' />
                                </Item.Description>
                            )}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> {format(activity.date, 'h:mm a')}
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendees attendees={activity.attendees} />
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