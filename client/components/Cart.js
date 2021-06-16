import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Cart extends Component {
  render() {
    // let addedCards = this.props.cards.length ? (
    //   this.props.cards.map((card) => {
    //     return (
    //       <li key={card.id}>
    //         <div>
    //           <img src={card.imgUrl} />
    //         </div>
    //         <p>{card.name}</p>
    //         <p>{card.description}</p>
    //         <p>{card.price}</p>
    //       </li>
    //     );
    //   })
    // ) : (
    //   <p>Nothing</p>
    // );

    return (
      <div>
        <h5>You have ordered:</h5>
        <ul></ul>
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    cards: state.addedCards,
  };
};

export default connect(mapState)(Cart);
