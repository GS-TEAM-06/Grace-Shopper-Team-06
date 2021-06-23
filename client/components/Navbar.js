import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';

import { AppBar, Toolbar, Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  header: {
    position: 'sticky',
  },
}));

const Navbar = (props) => {
  const classes = useStyles(props);

  return (
    <>
      <AppBar className={classes.header}>
        <Toolbar>
          <Link to="/">
            <img src="/favicon.ico" height="70" width="auto" />
          </Link>
          <Typography variant="h4">
            <Link to="/">Grace Shopper Team 6 </Link>
          </Typography>

          <nav>
            {props.isLoggedIn ? (
              <div>
                {/* The navbar will show these links after you log in */}
                <Link to="/user">My Profile</Link>
                <Link to="/cart">Cart</Link>
                <a href="#" onClick={props.handleClick}>
                  Logout
                </a>
              </div>
            ) : (
              <div>
                {/* The navbar will show these links before you log in */}
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
                <Link to="/cart">Cart</Link>
              </div>
            )}
          </nav>
        </Toolbar>
      </AppBar>
    </>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.auth.id,
  };
};

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);
