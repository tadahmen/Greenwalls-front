import React from 'react';
import jQuery from 'jquery';

class PlantSpot extends React.Component {
  constructor() {
    super()

    this.state = {
      plantPicture: "https://www.onlinepakhuis.nl/data/Bloempotten/bloempot-julia-oranje-d55-h50.jpg"
    }
  }

  loadPlantPicture(plantId) {
    let component = this;

    jQuery.getJSON(`http://localhost:5000/plants/${plantId}`, function(plantData) {
      console.log("loaded plant in plant spots: " + plantData.name);
      console.log("returning plantpicture: " + plantData.picture);
      component.setState({
        plantPicture: plantData.picture
      });
    })
  }

  componentWillReceiveProps() {
    console.log("Mount plant for spot with id: " + this.props.plantId);
    this.loadPlantPicture(25); //(this.props.plantId);
    // !isNaN(this.props.plantId) ? this.loadPlantPicture(this.props.plantId) : console.log("plant id is not valid");
  }

  render(){
    return(
      <div>
        <img className="plantSpot" src={this.state.plantPicture}/>
      </div>
    );
  }

}

export default PlantSpot;
