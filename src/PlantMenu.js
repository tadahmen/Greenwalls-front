import React from 'react';
import jQuery from 'jquery';

class PlantMenu extends React.Component {
  constructor() {
    super()

    this.state = {
      plants: ["gras", "roos", "tulp"]}
  }

  render(){
    return(
      <div>
        <p>plants:</p>
        <ul>
            {this.state.plants.map(function(plant, i){
              return(<li> {plant} </li>);
            }, this)}
        </ul>
      </div>
    );
  }
}

export default PlantMenu;
