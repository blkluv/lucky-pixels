function BlockSideBar({ children }) {
  const [blockSidebarState, setBlockSidebarState] = children;

  return (
    <div
      className={`drawer ${blockSidebarState && "drawer-open"}`}
      onClick={() => setBlockSidebarState("")}
    >
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div
        className="drawer-open drawer-side"
        id="sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu h-full w-80 bg-base-200 p-4 text-base-content">
          <li>
            <a>
              Pixel#
              {blockSidebarState
                ? blockSidebarState[0] * 100 + blockSidebarState[1] + 1
                : "00000"}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default BlockSideBar;
