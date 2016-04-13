import React from 'react';
import jQuery from 'jquery';
import PlantMenu from './PlantMenu';
import PlantSpot from './PlantSpot';

class PlantSpots extends React.Component {
  constructor() {
    super()

    this.state = {
      plantSpots: [{x_position:"0"}, {x_position:"1"}, {x_position:"2"}],
      count: 3,
      plantSpotPosition: ""
    }
  }

  reloadPlantSpots(plantsContainerId) {
    let component = this;
    console.log("LOADING PLANT SPOTS FROM DB");
    console.log("containerId for loading PlantSpots:" + plantsContainerId);
    console.log("id in props is: " + this.props.plantsContainerId); //shows that props still holds previous value

    jQuery.getJSON(`http://localhost:5000/plants_containers/${plantsContainerId}/plant_spots`, function(data) {
      console.log("loaded plantspots: " + data);
      component.setState({
        plantSpots: data.plant_spots
      });
    })
    .done(function() {
      console.log(component.state.newSpotCreated);
      if (component.state.newSpotCreated) {
        let spotsTotal = component.state.plantSpots.length;
        let newSpot = component.state.plantSpots[spotsTotal-1];//the total-1 gives the position of the new spot
        console.log(">>>>>CHECK VALUE: " + spotsTotal);
        component.setState({
          plantSpotId: newSpot.id, //to directly show 'add plantspot' button for new container
          newSpotCreated: false  //sets this value back to false
        });
      }
    });
  }

  createPlantSpot(event){
    let component = this;
    let plantsContainerId = this.props.plantsContainerId;

    let newPlantSpot ={
      id: null,
      x_position: this.state.plantSpots.length,
      plants_container_id: plantsContainerId
    }
    component.setState({
      newSpotCreated: true
    });
    console.log("number of plantspots in plantscontainer: " + this.state.plantSpots.length);

    jQuery.ajax({
      type:'POST',
      url: `http://localhost:5000/plants_containers/${plantsContainerId}/plant_spots`,
      data: JSON.stringify({
        plant_spot: newPlantSpot
      }),
      contentType: "application/json",
      dataType: "json"
    })
    .done(function(data) {
      component.props.onChange() //
    })
  }

  deletePlantSpot(event){
    console.log("DELETING PLANTSPOT");
    let component = this;

    jQuery.ajax({
      type: 'DELETE',
      url: `http://localhost:5000/plants_containers/${event.plantsContainerId}/plant_spots/${event.plantSpotId}.json`,
      contentType: "application/json",
      dataType: "json"
    })
    .done( function(){
      console.log("spot deleted");
      component.props.onChange();
    })
  }

  findById(plantId) {
    console.log("SEARCHING PLANT with id: " + plantId);
    let plantList = this.props.plants;

    for (var i = 0; i < plantList.length; i++) {
      if (plantList[i].id === plantId) {
        // console.log("found plant with picture: " + plant.picture);
        return plantList[i]
      }
    }
        // console.log("no plant found; returning default picture");
      return {picture: "https://www.onlinepakhuis.nl/data/Bloempotten/bloempot-julia-oranje-d55-h50.jpg"}
    }

  showPlantSpot(plantId, plantSpotId) {
    let plant = this.findById(plantId);
    let plantPicture = plant.picture;
    let plantSpotIdString = String(plantSpotId);
    let imageIdX = "plantImage".concat(plantSpotIdString);

    // let imageIdX = "imageClass".concat(plantSpotId);
    console.log("THE CLASSNAME OF THE IMAGE IS: " + imageIdX);
    console.log("using picture: " + plant.picture);

    return (
        <img id={imageIdX} className = "plantImage"  src={plantPicture}/>
    )
  }

  selectSpot(event) {
    console.log("SETTING PLANT SPOT TO SELECTED SPOT");
    console.log("id in selectSpot:" + event.plantSpotId);
    console.log("position of selected spot (0 for first): " + event.plantSpotPosition);
    this.setState({
      plantSpotPosition: event.plantSpotPosition,
      plantSpotId: event.plantSpotId
    });
    console.log("plantspot after setState: " + this.state.plantSpotPosition)
  }

  componentDidMount() {
    console.log("Mount PlantSpots");
    console.log("this.props.plants is:" + this.props.plants);
    // this.loadPlants();
    this.reloadPlantSpots(this.props.plantsContainerId);
  }

  componentWillReceiveProps(nextProps) {  //so it refreshes each time another plantscontainer is selected, and uses the newest props
    console.log("reload PlantSpots");
    this.setState({
      plantSpotPosition: "",
      plantsContainerId: nextProps.plantsContainerId
    });
    this.reloadPlantSpots(nextProps.plantsContainerId);
  }

  render(){
    return(
      <div>
        <PlantMenu plantSpotPosition={this.state.plantSpotPosition} plantSpotId={this.state.plantSpotId} plantsContainerId={this.props.plantsContainerId}/>
        <p>Plantcontainer: {this.props.plantsContainerName}</p>
        <div className="linedPlantSpots">
          {
            this.state.plantSpots.map(function(plantSpot, i){

              return(
                <button className="plantSpot" onClick={this.selectSpot.bind(this, {plantSpotPosition: plantSpot.x_position, plantSpotId: plantSpot.id, plantsContainerId: this.props.plantsContainerId})}>
                  <div className="deleteButton" onClick={this.deletePlantSpot.bind(this, {plantSpotId: plantSpot.id, plantsContainerId: this.props.plantsContainerId}) } >
                    {/*<p className="delete-symbol"> x </p>*/}
                    <span className="delete-symbol"> x </span>
                  </div>
                  {
                    this.showPlantSpot(plantSpot.plant_id, plantSpot.id)
                  }
                </button>

              );

            }, this)
          }
          <button className="plantSpot" onClick={this.createPlantSpot.bind(this)}>
            <p className="add-symbol"> + </p>
          </button>
        </div>
      </div>
    );
  }
}

export default PlantSpots;
