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
      component.setState({
        plants: data.plants
      });
    })
  }

  pastePicture(event) {
    // event.preventDefault();
    document.getElementsByClassName('plantSpot')[event.plantSpot].setAttribute("src", event.picture);
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
                return(<li>
                  <button onClick={this.pastePicture.bind(this, {picture: plant.picture, plantSpot: this.props.plantSpot})}>
                    {plant.name}
                  </button></li>);
            }, this)}
        </ul>
      </div>
    );
  }
}

export default PlantMenu;
