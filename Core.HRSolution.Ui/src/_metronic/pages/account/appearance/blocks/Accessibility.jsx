import { CardNotification } from '@/_metronic/partials/cards';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/_metronic/components/ui/select';
const Accessibility = () => {
  const items = [{
    icon: 'exit-right-corner',
    title: 'Shortcuts require modifier',
    description: 'Enable modifier keys for quick keyboard shortcuts.',
    actions: <div className="switch switch-sm">
          <input type="checkbox" name="param" defaultChecked value="1" readOnly />
        </div>
  }, {
    icon: 'disguise',
    title: 'High color contrast',
    description: 'Improve readability with high-contrast interface colors.',
    actions: <div className="switch switch-sm">
          <input type="checkbox" name="param" value="1" readOnly />
        </div>
  }, {
    icon: 'double-right-arrow',
    title: 'Autoplay videos',
    description: 'Choose preferences for automatic video playback.',
    actions: <div className="grow min-w-48">
          <Select defaultValue="1">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">System preferences</SelectItem>
              <SelectItem value="2">Sound</SelectItem>
              <SelectItem value="3">Focus</SelectItem>  
            </SelectContent>
          </Select>  
        </div>
  }, {
    icon: 'screen',
    title: 'Open links in Desktop',
    description: 'Links open in the desktop app for convenience.',
    actions: <div className="switch switch-sm">
          <input type="checkbox" name="param" defaultChecked value="1" readOnly />
        </div>
  }];
  const renderItem = (item, index) => {
    return <CardNotification icon={item.icon} title={item.title} description={item.description} actions={item.actions} key={index} />;
  };
  return <div className="card">
      <div className="card-header">
        <h3 className="card-title">Accessibility</h3>
      </div>

      <div id="notifications_cards">
        {items.map((item, index) => {
        return renderItem(item, index);
      })}
      </div>
    </div>;
};
export { Accessibility };