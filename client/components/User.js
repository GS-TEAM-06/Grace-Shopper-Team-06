import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUser } from "../store/user";

class User extends Component {
    constructor(props) {
      super(props);
    }
  
    componentDidMount() {
      const id = this.props.userId;
      this.props.fetchUser(id);
    }

    render() {
        const {user} = this.props;
      return (
        <div>
          <h3>Username: {user.username}</h3>
          <h4>Name: {user.firstname} {user.lastname}</h4>
          <h4>Email: {user.email}</h4>
        </div>
      );
    }
  }
  
  const mapState = (state) => {
    return {
      user: state.user,
    };
  };
  
  const mapDispatch = (dispatch) => {
    return {
      fetchUser: (id) => dispatch(fetchUser(id)),
    };
  };
  
  export default connect(mapState, mapDispatch)(User);