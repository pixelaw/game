import {plugins} from "../../../../global/config";
import Plugin, {Status} from "./components/Plugin";
import Footer from "./components/Footer";
import React from "react";

const PluginsPanel = () => {
  const [collapsed, setCollapsed] = React.useState(false)

  const handleClick = () => setCollapsed(prevCollapsed => !prevCollapsed)

  return (
    <div className={'absolute top-14 right-5'}>
      <div>
        <img
          src={`/assets/icon_chevron_${collapsed ? 'left' : 'right'}.svg`}
          alt={'collapse plugin panel button'}
          className={'cursor-pointer'}
          onClick={handleClick}
        />
      </div>

      <div>
        { plugins.map(({icon, name}) => (
          <Plugin icon={icon} label={name} status={Status.Idle} collapsed={collapsed} />
        ))}
      </div>
      <Footer coordinates={{x: 0, y: 0}} collapsed={collapsed} />
    </div>
  )
}

export default Object.assign(
  PluginsPanel,
  {
    Footer,
    Plugin
  }
)