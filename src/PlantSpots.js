import React from 'react';
import jQuery from 'jquery';
import App from './App';
import PlantMenu from './PlantMenu';
import EditableText from './EditableText';
// import PlantSpot from './PlantSpot';

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
    // console.log("(containerid in props is still old id: " + this.props.plantsContainerId + ")"); //(just to see if value in props 'received' new value from parent)

    jQuery.getJSON(`http://guarded-stream-41881.herokuapp.com/plants_containers/${plantsContainerId}/plant_spots`, function(data) { //request to db.
      component.setState({
        plantSpots: data.plant_spots,
      });
    })

    .done(function() {
        console.log("LOADED PLANTSPOTS: " + component.state.plantSpots);
        console.log(">>>>>>>>>CHECK total nr of spots: " + component.state.plantSpots.length);


        if (component.state.plantSpots.length === 0) { //if the container is empty, create its first plant spot
          component.createPlantSpot(plantsContainerId)
        }; //>>>>>>small ISSUE: when deleting all spots in a container, 2 spots are autocreated

        // if (component.state.autoCreateSpot) { //new containers are automatically filled with 1 spot
        //   component.createPlantSpot(plantsContainerId);
        // }

        console.log(">>>>CHECK newspotcreated: " + component.state.newSpotCreated);
        if (component.state.newSpotCreated) {   //automatically select a newly created plantspot
          let spotsTotal = component.state.plantSpots.length;
          let newSpot = component.state.plantSpots[spotsTotal-1];//the total-1 gives the position of the new spot

          component.setState({
            plantSpotId: newSpot.id, //selects the spot
            newSpotCreated: false  //sets this switch back to false
          });
        }
    });
  }

  createPlantSpot(){
    console.log("CREATING NEW PLANTSPOT")
    let component = this;
    let plantsContainerId = this.props.plantsContainerId;
    let newPlantSpot ={   //the new plantspot
      id: null,
      x_position: this.state.plantSpots.length,
      plants_container_id: plantsContainerId
    }

    this.setState({    //sets a switch to automatically select new spot after reloading
      newSpotCreated: true,   //switch to automatically select the new spot in reloadPlantSpots
    });

    jQuery.ajax({         //posts new plantspot
      type:'POST',
      url: `http://guarded-stream-41881.herokuapp.com/plants_containers/${plantsContainerId}/plant_spots`,
      data: JSON.stringify({
        plant_spot: newPlantSpot
      }),
      contentType: "application/json",
      dataType: "json"
    })
    .done(function(data) {
      // reloadPlantSpots(plantsContainerId);
      component.props.onChange() //reloads plantcontainer to directly show new spot on screen
    })
  }

  deletePlantSpot(event){ //to delete plant spot from db
    console.log("DELETING PLANTSPOT");
    let component = this;

    jQuery.ajax({ //request to db
      type: 'DELETE',
      url: `http://guarded-stream-41881.herokuapp.com/plants_containers/${event.plantsContainerId}/plant_spots/${event.plantSpotId}.json`,
      contentType: "application/json",
      dataType: "json"
    })
    .done( function(){
      console.log("spot deleted");
      component.props.onChange(); //reloads plantscontainers to refresh the screen
    })
  }

  findById(plantId) {   //to find the picture for the plant
    console.log("SEARCHING PLANT with id: " + plantId);
    let plantList = this.props.plants;

    for (var i = 0; i < plantList.length; i++) {  //to find the plant in the plants array
      if (plantList[i].id === plantId) {
        return plantList[i]
      }
    }
      return ("not found");
    }

  showPlantSpot(plantId, plantSpotId) {
    let plant = this.findById(plantId);
    let plantPicture = "";
    if (plant === "not found") {  //if no plant was found, return default picture
      plantPicture = "https://www.onlinepakhuis.nl/data/Bloempotten/bloempot-julia-oranje-d55-h50.jpg";
    }
    else {
      plantPicture = plant.picture;
    }


    let plantSpotIdString = String(plantSpotId);
    let imageIdX = "plantImage".concat(plantSpotIdString);

    // let imageIdX = "imageClass".concat(plantSpotId);
    console.log("THE CLASSNAME OF THE IMAGE IS: " + imageIdX);
    console.log("using picture: " + plant.picture);

    return (
        <img id={imageIdX} className = "plantImage"  src={plantPicture}/>
    )
  }

  selectSpot(event) {   //selects the spot for putting (new) plant in it
    console.log("SETTING PLANT SPOT TO SELECTED SPOT");
    console.log("id in selectSpot:" + event.plantSpotId);
    console.log("position of selected spot (0 for first): " + event.plantSpotPosition);
    this.setState({
      plantSpotPosition: event.plantSpotPosition,
      plantSpotId: event.plantSpotId
    });
    console.log("plantspot after setState: " + this.state.plantSpotPosition)
  }

  updateName(newName) {
    console.log("UPDATING NAME: " + newName)
    let component = this;

    this.setState({ plantsContainerName: newName });

    jQuery.ajax({
      type: "PATCH",
      url: `http://guarded-stream-41881.herokuapp.com/plants_containers/${this.props.plantsContainerId}.json`,
      data: JSON.stringify({
        plants_container: {name: newName, price: ""}
      }),
      contentType: "application/json",
      dataType: "json"
    })
      .done(function(data) {
        console.log(data);
        component.props.onChange();
        })
      .fail(function(error) {
        console.log(error);
      });
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
      plantsContainerId: nextProps.plantsContainerId,
    });
    this.reloadPlantSpots(nextProps.plantsContainerId);
  }

  render(){
    return(
      <div className="plantSpots-component">
        <h4 className="container-title">Plantcontainer: &nbsp;
          <EditableText
            value={this.props.plantsContainerName}
            onChange={this.updateName.bind(this)}/>
        </h4>

        <div className="plantMenu">
          <PlantMenu
            plantSpotPosition={this.state.plantSpotPosition}
            plantSpotId={this.state.plantSpotId}
            plantsContainerId={this.props.plantsContainerId}
            onClick={this.createPlantSpot.bind(this)}/>
        </div>

        <div className="linedPlantSpots">
          {
            this.state.plantSpots.map(function(plantSpot, i){
              return(

                <button className="plantSpot"
                  onClick={this.selectSpot.bind(this, {plantSpotPosition: plantSpot.x_position, plantSpotId: plantSpot.id, plantsContainerId: this.props.plantsContainerId})}>
                  <div className="deleteButton"
                    onClick={this.deletePlantSpot.bind(this, {plantSpotId: plantSpot.id, plantsContainerId: this.props.plantsContainerId}) } >
                    <span className="delete-symbol"> x </span>
                  </div>
                  { this.showPlantSpot(plantSpot.plant_id, plantSpot.id) }
                </button>

              );

            }, this)
          }
        </div>
      </div>
    );
  }
}

export default PlantSpots;
