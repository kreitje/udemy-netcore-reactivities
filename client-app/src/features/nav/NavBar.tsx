import React, {useContext} from 'react'
import { Menu, Container, Button } from 'semantic-ui-react'
import ActivityStore from '../../app/stores/activityStore';
import {observer} from 'mobx-react-lite';

const NavBar = () => {
    const activityStore = useContext(ActivityStore);
    return (
        <Menu inverted fixed='top' >
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: 10}} />
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities' />
                <Menu.Item>
                    <Button positive content="Create Activity" onClick={activityStore.openCreateForm} />
                </Menu.Item>
            </Container>
      </Menu>
    )
}

export default observer(NavBar);