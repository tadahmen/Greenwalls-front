import React from 'react';
import jQuery from 'jquery';
import App from './App';
import PlantSpots from './PlantSpots';

class PlantsContainerList extends React.Component {
  constructor() {
    super()

    this.state = {
      plantsContainers: [{}],
      plantsContainerId: "",
      plantsContainerName: "",
      count: 0,
      plants: [],
      timesLoaded: 0,
    }
  }

  reloadPlantsContainers(event) {   //loads (new) list of plantscontainers from db
    let component = this;
    console.log("LOADING CONTAINERLIST FROM DB");
    console.log("container id after (re)loading: " + component.state.plantsContainerId)

    jQuery.getJSON(`http://localhost:5000/plants_containers`, function(data) {  //request to db.
      console.log("CONTAINERLIST LOADED: " + data);
      component.setState({
        plantsContainers: data.plants_containers,
        count: data.meta.count
      })
    })
    .done(function() {  //if new container was created, automatically select it to fill it with 1 plantspot and show it
      console.log(">>>>>CHECK new container created? " + component.state.newContainerCreated);
      if (component.state.newContainerCreated) { //TRUE if new container has just been created
        let containersTotal = component.state.plantsContainers.length;
        let newContainer = component.state.plantsContainers[containersTotal-1];//the total-1 gives the position of the current last container
        console.log("total nr. of containers: " + containersTotal);
        component.setState({
          plantsContainerId: newContainer.id, //selects container. And PlantSpots' componentWillReceiveProps is called, fills it with 1 plantspot and displays it
          plantsContainerName: newContainer.name, //>>>>>>>>>>>to show new containername
          newContainerCreated: false
        });
      }
    });
  }

  loadPlants() {  //loads all plants from db. Done here, to easily reach this data when needed in plantSpots (a child)
    let component = this;
    console.log("LOADING PLANTLIST FROM DB");

    jQuery.getJSON(`http://localhost:5000/plants`, function(data) {
      console.log("PLANTLIST LOADED: " + data);
      component.setState({
        plants: data.plants
      });
    })
  }

  // toggleNewContainerSwitch() {
  //   this.setState({
  //     newContainerCreated: !this.state.newContainerCreated   //a switch to make reloadPlantsContainers select the new container, so it's (empty) content is displayed on screen
  //   });
  // }

  createPlantsContainer(event) {  //to make new, empty plants container in db
    let component = this;
    let newPlantsContainer = { //the Container.
      id: null,
      name: "new plants-container"
    };

    // component.toggleNewContainerSwitch();  //sets newContainerCreated to TRUE, so reloadPlantsContainers will select the new container
    this.setState({
      newContainerCreated: true   //a switch to make reloadPlantsContainers select the new container, so it's (empty) content is displayed on screen
    });

    jQuery.ajax({   //post request to db
      type:'POST',
      url: `http://localhost:5000/plants_containers`,
      data: JSON.stringify({
        plants_container: newPlantsContainer
      }),
      contentType: "application/json",
      dataType: "json"
    })
    .done(function() { //to directly show new container in list on screen
      console.log("new plants container succesfully created");

      component.reloadPlantsContainers() //shows new container on screen
    })
  }

  deletePlantsContainer(event) {
    console.log("DELETING PLANTS CONTAINER");
    let component = this;

    jQuery.ajax({
      type: 'DELETE',
      url: `http://localhost:5000/plants_containers/${event}.json`,
      contentType: "application/json",
      dataType: "json"
    })
    .done( function(){
      console.log("container succesfully deleted");
      console.log("CHECK id of deleted container: " + event);
      component.reloadPlantsContainers();     //plantcontainerlist on screen refreshes
      if (component.state.plantsContainerId === event) { //if plantspots shown are that of the deleted container...
        component.setState({
            plantsContainerId: ""   // ...the screen refreshes without any plantspots.
        });
      }
    })
  }

  componentDidMount() {
    console.log("MOUNTING CONTAINERLIST");
    this.reloadPlantsContainers();
    this.loadPlants();
  }

  renderPlantSpots(plantsContainerId, plantsContainerName){
    return <PlantSpots className="placeHolder"
        onChange={this.reloadPlantsContainers.bind(this)}
        plantsContainerId={plantsContainerId}
        plantsContainerName={plantsContainerName}
        plants={this.state.plants}
        containerIsNew={this.state.newContainerCreated}/>;
  }

  setContainerId(event) {
    console.log("SELECTING CONTAINER");
    console.log("new plantsContainerId:" + event.id);
    this.setState({
      plantsContainerId: event.id,
      plantsContainerName: event.name
    })
      console.log("this.state.plantsContainerId after setState is old id:" + this.state.plantsContainerId)
  }

  render(){
    return(
      <div className="plantscontainer-component">
        <div className= "plantscontainer-menu">
          {/*<p>Plantcontainers:</p>*/}
          {
            this.state.plantsContainers.map(function(plantsContainer, i){ //shows all plantscontainernames, each with delete button

              return(
                <div className="wrapper">
                  <button className="plantsContainer" onClick={this.setContainerId.bind(this, plantsContainer)}> {/*clicked container is selected*/}
                    <span className="containerName"> {plantsContainer.name} </span>
                  </button>
                  <button className="deleteContainer" onClick={this.deletePlantsContainer.bind(this, plantsContainer.id)}>
                    <span className="deleteSymbol"> x </span> {/*container is deleted on clicking 'x'*/}
                  </button>
                </div>
              );
            }, this)
          }

          <button className="add-container" onClick={this.createPlantsContainer.bind(this)}> {/*creates new container on click*/}
            <span className="addContainer-symbol"> + </span>
          </button>

        </div>  {/*end of div plantscontainer-menu*/}

        <div>
          {
            this.state.plantsContainerId !== "" //to see that on starting the app, no unnecessary rendering is done
              ? this.renderPlantSpots(this.state.plantsContainerId, this.state.plantsContainerName)
              : <p>Choose a plantcontainer</p>
          }
        </div>
      </div>
    );
  }
}

export default PlantsContainerList;
