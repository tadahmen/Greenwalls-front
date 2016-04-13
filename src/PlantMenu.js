import React from 'react';
import jQuery from 'jquery';

class PlantMenu extends React.Component {
  constructor() {
    super()

    this.state = {
      plants: [{name:"grass"}, {name:"roos"}, {name:"tulp"}]  //if data cannot be loaded from db
      //also put some pictures here (for same reason)
    }
  }

  reloadPlants(event) {
    let component = this;

    jQuery.getJSON(`http://localhost:5000/plants`, function(data) {
      console.log("loaded Plantlist: " + data);
      component.setState({
        plants: data.plants
      });
    })
  }

  savePlantInSpot(plantSpotId, plantId, plantsContainerId){
    let spotWithNewPlant = {     //to ensure the new data are used. (data in this.state could still be the 'old' data)
      plants_container_id: plantsContainerId,
      plant_id: plantId,
    };
    console.log("SAVING NEW PLANT IN SPOT");
    console.log("id (of plantspot):" + plantSpotId);
    console.log("plant_id :" + plantId);
    console.log("plants_container_id :" + plantsContainerId);  //to check if the new values were taken

    jQuery.ajax({
      type: "PUT",
      url:`http://localhost:5000/plants_containers/${plantsContainerId}/plant_spots/${plantSpotId}.json`,
      data: JSON.stringify({
        plant_spot: spotWithNewPlant
      }),
      contentType: "application/json",
      dataType: "json"
    })
      .done(function(data) {
        console.log(data);
        })
      .fail(function(error) {
        console.log(error);
      });
  }

  putPictureInSpot(plantSpotId, plantSpotPosition, plantPicture) {
    let plantSpotIdString = String(plantSpotId);
    let imageIdX = "plantImage".concat(plantSpotIdString);

    // let imageIdX = "imageClass".concat(plantSpotId);
    console.log("THE CLASSNAME OF THE IMAGE IS: " + imageIdX);
    console.log("using picture: " + plantPicture);

    document.getElementById(imageIdX).setAttribute("src", plantPicture);
  }

  putPlantInSpot(event) {
    // event.preventDefault();
    console.log("put picture:" + event.plantPicture + " in spot with position: " + event.plantSpotPosition + ", and with id: " + event.plantSpotId);
    this.putPictureInSpot(event.plantSpotId, event.plantSpotPosition, event.plantPicture);
    this.savePlantInSpot(event.plantSpotId, event.plantId, event.plantsContainerId)
  }

  componentDidMount() {
    console.log("mount PlantMenu");
    this.reloadPlants();
  }

  render(){
    return(
      <div>
        <p>plants:</p>
        <ul>
            {
              this.state.plants.map(function(plant, i){
                return(<li>
                  <button onClick={this.putPlantInSpot.bind(this, {plantPicture: plant.picture, plantSpotPosition: this.props.plantSpotPosition, plantSpotId: this.props.plantSpotId, plantId: plant.id, plantsContainerId: this.props.plantsContainerId} )}>
                    {plant.name}
                  </button></li>);
            }, this)}
        </ul>
      </div>
    );
  }
}

export default PlantMenu;
