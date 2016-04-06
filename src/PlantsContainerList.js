import React from 'react';
import jQuery from 'jquery';
import PlantSpots from './PlantSpots';

class PlantsContainerList extends React.Component {
  constructor() {
    super()

    this.state = {
      plantsContainers: [{}],
      count: 0,
    }
  }

  reloadPlantsContainers(event) {
    let component = this;

    jQuery.getJSON(`http://localhost:5000/plants_containers`, function(data) {
      console.log(data);
      component.setState({
        plantsContainers: data.plants_containers,
        count: data.meta.count
      });
    })
  }

  componentDidMount() {
    console.log("didMount");
    this.reloadPlantsContainers();
  }

  log(event) {
    console.log("clicked container")
  }

  render(){
    return(
      <div>
        <p>plantcontainers:</p>
          <ul>
            {
              this.state.plantsContainers.map(function(plantsContainer, i){
                return(
                  // <li className="plantsContainer">
                    <button onClick={this.log.bind(this)}> {/*this.log.bind(this)*/}
                     {plantsContainer.name}
                    </button>
                  // </li>
                );
            }, this)
          }
          </ul>
      </div>
    );
  }
}

export default PlantsContainerList;
