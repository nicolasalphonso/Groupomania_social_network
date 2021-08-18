import React from 'react';
import Navbar from '../components/Navbar';
import ProfileContainer from '../components/ProfileContainer';

/** functional component : displays navbar and profile container
 */
const Profile = () => {
    return (
        <div>
            <Navbar />
            <ProfileContainer />
        </div>
    );
};

export default Profile;