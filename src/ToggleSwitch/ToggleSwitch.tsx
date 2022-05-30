import React from "react";
import './ToggleSwitch.css';


interface ToggleSwitchProps {
	id: string;
	name?: string;
	checked: boolean;
	onChange: any;
  optionLabels?: string[];
  small?: boolean;
  disabled?: boolean;
}


export class ToggleSwitch extends React.PureComponent<ToggleSwitchProps> {

	constructor (props: ToggleSwitchProps) {
		super(props);

    let booleanCheck:boolean = true;
    if(this.props.checked){
      booleanCheck = this.props.checked;
    }
	}

  handleKeyPress(e:any): void {
    if (e.keyCode !== 32) return;

    e.preventDefault();
    this.props.onChange(this.props.checked)
  }


  render (): React.ReactNode {

    let optionLabels= ["Yes", "No"]
    if(this.props.optionLabels){optionLabels = this.props.optionLabels}

    return (
      <div className={"toggle-switch" + (this.props.small ? " small-switch" : "")}>
        <input
          type="checkbox"
          name={this.props.name}
          className="toggle-switch-checkbox"
          id={this.props.id}
          checked={this.props.checked}
          onChange={e => this.props.onChange(e.target.checked)}
          disabled={this.props.disabled}
          />
          {this.props.id ? (
            <label className="toggle-switch-label"
                   htmlFor={this.props.id}
                   tabIndex={ this.props.disabled ? -1 : 1 }
                   onKeyDown={ (e) => { this.handleKeyPress(e) }}>
              <span
                className={
                  this.props.disabled
                    ? "toggle-switch-inner toggle-switch-disabled"
                    : "toggle-switch-inner"
                }
                data-yes={optionLabels[0]}
                data-no={optionLabels[1]}
                tabIndex={-1}
              />
              <span
                className={
                this.props.disabled
                  ? "toggle-switch-switch toggle-switch-disabled"
                  : "toggle-switch-switch"
                }
                tabIndex={-1}
              />
            </label>
          ) : null}
        </div>
      );
  }

	renderRefreshing (): React.ReactNode {
		return (
			<div style={{height: '100%', display:'flex', alignItems: 'center', justifyContent: 'center'}}>
				<Spinner />
			</div>
		);
	}
}
