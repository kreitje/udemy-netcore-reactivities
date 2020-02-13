import React, {useContext, useState} from 'react';
import { Grid, Tab, Header, Card, Image, Button } from 'semantic-ui-react';
import {observer} from 'mobx-react-lite';
import {RootStoreContext} from '../../app/stores/rootStore';
import {PhotoUploadWidget} from '../../app/common/photoUpload/PhotoUploadWidget';

const ProfilePhotos = () => {
    const rootStore = useContext(RootStoreContext);
    const {profile, isCurrentUser, uploadPhoto, uploadingPhoto, setMainPhoto, loading, deletePhoto} = rootStore.profileStore;
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState<string | undefined>(undefined);
    const [deleteTarget, setDeleteTarget] = useState<string | undefined>(undefined);
    
    const handleUploadImage = (photo: Blob) => {
        uploadPhoto(photo).then(() => setAddPhotoMode(false));
    };

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{paddingBottom: 0}}>
                    <Header icon='image' content='Photos' floated='left' />
                    {isCurrentUser && (
                        <Button 
                            floated='right' 
                            basic 
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handleUploadImage} loading={uploadingPhoto} />
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile && profile.photos.map((photo) => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button 
                                                basic 
                                                positive 
                                                content='Main'
                                                name={photo.id}
                                                onClick={(e) => {
                                                    setMainPhoto(photo);
                                                    setTarget(e.currentTarget.name);
                                                }}
                                                loading={loading && target === photo.id}
                                                disabled={photo.isMain}
                                            />
                                            <Button 
                                                basic 
                                                negative
                                                name={photo.id}
                                                icon='trash'
                                                onClick={(e) => {
                                                    deletePhoto(photo);
                                                    setDeleteTarget(e.currentTarget.name);
                                                }}
                                                loading={loading && deleteTarget === photo.id}
                                                disabled={photo.isMain}
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
};

export default observer(ProfilePhotos);