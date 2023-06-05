import { InjectionZone, Widget, WidgetExtension } from "./types"

type Widgets = Map<InjectionZone, Widget[]>

class WidgetRegistry {
  private widgets: Widgets = new Map()

  public registerWidget(origin: string, widget: WidgetExtension) {
    const { zone } = widget.config

    const zones = Array.isArray(zone) ? zone : [zone]

    for (let widgetZone of zones) {
      const widgets = this.widgets.get(widgetZone) || []
      widgets.push({ origin, Widget: widget.Component })

      this.widgets.set(widgetZone, widgets)
    }
  }

  public getWidgets(zone: InjectionZone) {
    return this.widgets.get(zone) || []
  }
}

export default WidgetRegistry
