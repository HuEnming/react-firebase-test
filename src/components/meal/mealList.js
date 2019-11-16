import React, { Component } from 'react'
import firebase from '../firebase/firebase'

class MealList extends Component {

    state = {
        //userId: '',
        mealLsit: null,
        error: null
    }

    componentDidMount() {
        this.removeAuthListener = firebase.auth().onAuthStateChanged((user) => {
            //()=>{} is necessary, can't use function(){} there, for reasons of 'this' 
            if (user) {
                //this.setState({ userId: user.uid })
                let mealLsit = []
                let mealsRef = firebase.database().ref().child('meals')
                    .orderByChild('userId').equalTo(user.uid).on('child_added', (snapshot) => {
                        mealLsit.push(snapshot.val())
                        this.setState((preState) => ({ ...preState, mealLsit }))
                    })
                
                console.log(firebase.database().ref().child('meals'))
                let foodRef = firebase.database().ref('meals')
                    .orderByChild('userId').equalTo(user.uid).on('value', (snapshot) => {
                        //mealLsit.push(snapshot.val())
                        //this.setState((preState) => ({ ...preState, mealLsit }))
                        Object.keys(snapshot.val()).map((key, index) => (
                            console.log(snapshot.val())
                        ))
                        
                    })
            } else {
                this.props.history.push('/');
            }
        })
    }

    componentWillUnmount() {
        this.removeAuthListener();
    }

    handleDelete = (foodId) => {
        console.log(foodId)
        firebase.database().ref(`meals/${foodId}`).remove().catch(error => {
            this.setState({ error })
        })
    }

    render() {
        const { mealLsit } = this.state
        console.log(mealLsit)
        if (mealLsit) {
            return (
                <div className="row" >
                    {mealLsit.map((food, index) => (
                        <div className="col s12 m2" key={index}>
                            <div className="card">
                                <div className="card-image">
                                    <img src={food.imgUrl}></img>
                                    <span className="card-title">{food.foodName}</span>
                                </div>
                                <div className="card-content">
                                    <p>Amount:{food.amount}</p>
                                    <p>Meal Date:{food.mealDate}</p>
                                    {
                                        Object.keys(food.nutrients).map((key, index) => (
                                            <p key={index}>{key}:{food.nutrients[key]}</p>
                                        ))
                                    }
                                </div>
                                <div className="card-action">
                                    <a href="#">Detial</a><a href="#" onClick={() => this.handleDelete(food.foodId)}>Delete</a>
                                </div>
                            </div>
                        </div>

                    ))}</div>
            )
        } else {
            return (<div>Loading...</div>)
        }
    }
}

export default MealList
