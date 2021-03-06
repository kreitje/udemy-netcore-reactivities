import React, {useContext} from 'react'
import { Menu, Container, Button, Image, Dropdown } from 'semantic-ui-react'
import {observer} from 'mobx-react-lite';
import {Link, NavLink} from 'react-router-dom';
import {RootStoreContext} from '../../app/stores/rootStore';

const NavBar = () => {
    const rootStore = useContext(RootStoreContext);
    const {user, logout} = rootStore.userStore;

    return (
        <Menu inverted fixed='top' >
            <Container>
                <Menu.Item header as={NavLink} to='/' exact>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: 10}} />
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities' as={NavLink} to='/activities' />
                <Menu.Item>
                    <Button positive content="Create Activity" as={NavLink} to='/createActivity' />
                </Menu.Item>
                {user && (
                    <Menu.Item position='right'>
                        <Image avatar spaced='right' src={user.image || '/assets/user.png'} />
                        <Dropdown pointing='top left' text={user.displayName}>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to={`/profile/${user.username}`} text='My profile' icon='user' />
                                <Dropdown.Item onClick={logout} text='Logout' icon='power' />
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                )}
            </Container>
      </Menu>
    )
};

export default observer(NavBar);