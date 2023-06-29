function Sidebar({ children }) {
  const { sideBarState, setSideBarState } = children;
  return (
    <div
      className={`absolute drawer ${sideBarState && "drawer-open"}`}
      onClick={() => setSideBarState("")}
    >
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className={`drawer-content p-5 ${sideBarState != "" && "hidden"}`}>
        <label htmlFor="my-drawer" className="btn drawer-button">
          Menu
        </label>
      </div>
      <div
        className="drawer-side drawer-open"
        id="sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        {sideBarState == "" ? (
          <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
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
        ) : (
          <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
            <li>
              <a>
                Pixel#
                {sideBarState[0] * 100 + sideBarState[1] + 1}
              </a>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
