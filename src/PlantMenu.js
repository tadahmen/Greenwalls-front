import React from 'react';
import jQuery from 'jquery';

class PlantMenu extends React.Component {
  constructor() {
    super()

    this.state = {
      plants: [{name:"grass"}, {name:"roos"}, {name:"tulp"}]
    }
  }

  reloadPlants(event) {
    console.log("didLoad")
    let component = this;

    jQuery.getJSON(`http://localhost:5000/plants`, function(data) {
      console.log(data);
      console.log("gets here");
      component.setState({
        plants: data.plants
      });
    })
  }

  pastePicture(event) {
    // event.preventDefault();
    document.getElementsByClassName('plantSpot')[event.plantSpot].setAttribute("src", event.picture);
    console.log(event.name)
  }

  componentDidMount() {
    console.log("didMount");
    this.reloadPlants();
  }

  render(){
    return(
      <div>
        <p>plants:</p>
        <ul>
            {
              this.state.plants.map(function(plant, i){
              return(<li> <button onClick={
                this.pastePicture.bind(this, {picture: plant.picture, plantSpot: 1})
                // console.log("dit wordt ook nog uitgevoerd!")
              }> {plant.name} </button></li>);
            }, this)}
        </ul>
        <img className="plantSpot" src="https://www.onlinepakhuis.nl/data/Bloempotten/bloempot-julia-oranje-d55-h50.jpg"/>
        <img className="plantSpot" src="https://www.onlinepakhuis.nl/data/Bloempotten/bloempot-julia-oranje-d55-h50.jpg"/>
      </div>
    );
  }
}

export default PlantMenu;
