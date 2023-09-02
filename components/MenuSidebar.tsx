function MenuSidebar() {
  return (
    <div className={`drawer absolute`}>
      <input id="menu-drawer" type="checkbox" className="drawer-toggle" />
      <div className={`drawer-content absolute p-5`}>
        <label htmlFor="menu-drawer" className="drawer-button btn">
          Menu
        </label>
      </div>
      <div
        className="drawer-open drawer-side z-10"
        id="sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        <label htmlFor="menu-drawer" className="drawer-overlay"></label>
        <ul className="menu h-full w-80 bg-base-200 p-4 text-base-content">
          <li>
            <a>About us</a>
          </li>
          <li>
            <a>Roadmap</a>
          </li>
          <li>
            <a>Blog</a>
          </li>
          <li>
            <a>Discord</a>
          </li>
          <li>
            <a>Twitter</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MenuSidebar;
