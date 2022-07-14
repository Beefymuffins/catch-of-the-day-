import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import AddFishForm from './AddFishForm';
import EditFishForm from './EditFishForm';
import Login from './Login';
import base, { firebaseApp } from '../base';

class Inventory extends React.Component {
    static propTypes = {
        fishes: PropTypes.object,
        updateFish: PropTypes.func,
        deleteFish: PropTypes.func,
        addFish: PropTypes.func,
        loadSampleFishes: PropTypes.func,
    };

    state = {
        uid: null,
        owner: null,
    };

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.authHandler({ user });
            }
        });
    }

    authHandler = async (authData) => {
        // 1. Look up the current store in the firebase database
        const store = await base.fetch(this.props.storeId, { content: this });
        // 2. Claim it if there is no owner
        if (!store.owner) {
            // save it as out own
            await base.post(`${this.props.storeId}/owner`, { data: authData.user.uid });
        }
        // 3. Set the sate of the inventory component to reflect the current user
        this.setState({
            uid: authData.user.uid, // checks who's logging in
            owner: store.owner || authData.user.uid, // checks what the owners uid is, and compares the two to see if they are owner
        });
    };

    authenticate = (provider) => {
        const authProvider = new firebase.auth[`${provider}AuthProvider`]();
        firebaseApp.auth().signInWithPopup(authProvider).then(this.authHandler);
    };

    logout = async () => {
        await firebase.auth().signOut();
        this.setState({ uid: null });
    };

    render() {
        const logout = (
            <button type="button" onClick={this.logout}>
                Log Out!
            </button>
        );

        // 1. check if they are logged in
        if (!this.state.uid) {
            return <Login authenticate={this.authenticate} />;
        }

        // 2. Check if they are not the owner of the store
        if (this.state.uid !== this.state.owner) {
            return (
                <div>
                    <p>Sorry, you are not the owner.</p>
                    {logout}
                </div>
            );
        }

        // 3. They must be the owner, just render the inventory normally
        return (
            <div className="inventory">
                <h2>Inventory</h2>
                {logout}
                {Object.keys(this.props.fishes).map((key) => (
                    <EditFishForm
                        key={key}
                        index={key}
                        fish={this.props.fishes[key]}
                        updateFish={this.props.updateFish}
                        deleteFish={this.props.deleteFish}
                    />
                ))}
                <AddFishForm addFish={this.props.addFish} />
                <button type="button" onClick={this.props.loadSampleFishes}>
                    Load Sample Fish
                </button>
            </div>
        );
    }
}

export default Inventory;
