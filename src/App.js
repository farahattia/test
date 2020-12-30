import React from 'react';
import './App.css';
import Vente from "./components/Vente";
import {Switch ,Route, BrowserRouter } from 'react-router-dom';
import home from './assets/home.jpg'

function App () {

    //si l'utilisateur n'a pas entrer un url valide
    function Home() {
        return (
            <div className="col-md-12">
                <div  style= {{ backgroundImage: `url(${home}` ,backgroundRepeat: 'no-repeat',width:'1000px',height:'550px',color:'white'}}  
                >         
                <center><h1  style={{ color: 'black' }} >Please enter a brand in the URL : /brand/offer_id </h1></center> 
                    
                    </div>
          
          </div>
        );
      }

    
    return (
        <div className="row">
            <div className="col-md-10 offset-md-1">
            <BrowserRouter>
                <Switch>
                    <Route exact path="/brand/:offer_id" component={() => <Vente  /> } />
                    <Route path="/"><Home /></Route>
                </Switch>
            </BrowserRouter>
            </div>

        </div>
    )

}

export default App;