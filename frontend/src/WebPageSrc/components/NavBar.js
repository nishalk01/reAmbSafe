import React from 'react'

function NavBar() {
    return (
        <div className="mb-5">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
  <div className="container-fluid">
    <button
      className="navbar-toggler"
      type="button"
      data-mdb-toggle="collapse"
      data-mdb-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <i className="fas fa-bars"></i>
    </button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <a className="navbar-brand mt-2 mt-lg-0" href="#">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png"
          height="25"
          alt=""
          loading="lazy"
        />
      </a>
      {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link" href="#"></a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Team</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Profile</a>
        </li>
      </ul> */}
    </div>
   

    <div className="d-flex align-items-center">
     
      <a
        className="text-reset me-3 dropdown-toggle hidden-arrow"
        href="#"
        role="button"
      >
        <i className="fas fa-bell" style={{fontSize:"28px" }}></i>
        <span className="badge rounded-pill badge-notification bg-danger">new</span>
      </a>
      <a
        className="dropdown-toggle d-flex align-items-center hidden-arrow"
        href="#"
        id="navbarDropdownMenuLink"
        role="button"
        data-mdb-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png"
          className="rounded-circle"
          height="25"
          alt=""
          loading="lazy"
        />
      </a>
      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="navbarDropdownMenuLink"
      >
        <li>
          <a className="dropdown-item" href="#">My profile</a>
        </li>
        <li>
          <a className="dropdown-item" href="#">Settings</a>
        </li>
        <li>
          <a className="dropdown-item" href="#">Logout</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
        </div>
    )
}

export default NavBar
