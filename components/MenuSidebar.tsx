"use client";

function MenuSidebar() {
  return (
    <div className={`drawer absolute`}>
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className={`drawer-content p-5`}>
        <label htmlFor="my-drawer" className="drawer-button btn">
          Menu
        </label>
      </div>
      <div
        className="drawer-open drawer-side"
        id="sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
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
