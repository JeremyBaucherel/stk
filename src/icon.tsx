import './icon.css';
import * as React from 'react';
import * as Common from './common';
import {Tooltip} from './tooltip';

export enum EIcon {
    ACCOUNT_CIRCLE = 'account_circle',
    ACCOUNT_TREE = 'account_tree',
    ADD = 'add',
    ADD_CIRCLE = 'add_circle',
    ADD_CIRCLE_OUTLINE = 'add_circle_outline',
    ARROW_BACK = 'arrow_back',
    ARROW_DROP_DOWN = 'arrow_drop_down',
    ARROW_DROP_UP = 'arrow_drop_up',
    ATTACH_FILE = 'attach_file',
    AUTORENEW = 'autorenew',
    BLOCK = 'block',
    BUG_REPORT = 'bug_report',
    BUILD = 'build',
    CALL_SPLIT = 'call_split',
    CANCEL = 'cancel',
    CHANGE_HISTORY = 'change_history',
    CHECK = 'check',
    CHECK_BOX = 'check_box',
    CHECK_BOX_OUTLINE_BLANK = 'check_box_outline_blank',
    CHECK_CIRCLE = 'check_circle',
    CHEVRON_LEFT = 'chevron_left',
    CHEVRON_RIGHT = 'chevron_right',
    CLOSE = 'close',
    CLOUD_OFF = 'cloud_off',
    CREATE_NEW_FOLDER = 'create_new_folder',
    DELETE = 'delete',
    DONE = 'done',
    DONE_ALL = 'done_all',
    EDIT = 'edit',
    ERROR = 'error',
    ERROR_OUTLINE = 'error_outline',
    EVENT = 'event',
    EVENT_BUSY = 'event_busy',
    EXPAND_MORE = 'expand_more',
    FACE = 'face',
    FEED_BACK = 'feedback',
    FILE_DOWNLOAD = 'file_download',
    FILTER_LIST = 'filter_list',
    FLAG = 'flag',
    FOLDER = 'folder',
    FOLDER_OPEN = 'folder_open',
    FOLDER_SPECIAL = 'folder_special',
    FULLSCREEN = 'fullscreen',
    HELP_OUTLINE = 'help_outline',
    HOURGLASS_EMPTY = 'hourglass_empty',
    INBOX = 'inbox',
    INFO = 'info',
    INFO_OUTLINE = 'info_outline',
    LIBRARY_BOOKS = 'library_books',
    LOCK = 'lock',
    LOOKS_ONE = 'looks_one',
    LOOKS_TWO = 'looks_two',
    LOOKS_THREE = 'looks_three',
    MORE_HORIZ = 'more_horiz',
    OPEN_IN_BROWSER = 'open_in_browser',
    PERSON = 'person',
    PERSON_ADD = 'person_add',
    PERSON_PIN = 'person_pin',
    PLACE = 'place',
    POWER_SETTINGS_NEW = 'power_settings_new',
    RADIO_BUTTON_UNCHECKED = 'radio_button_unchecked',
    REFRESH = 'refresh',
    REMOVE_RED_EYE = 'remove_red_eye',
    SEARCH  = 'search',
    SCHEDULE = 'schedule',
    SECURITY = 'security',
    SEND = 'send',
    SETTINGS = 'settings',
    SETTINGS_INPUT_COMPONENT = 'settings_input_component',
    SHARE = 'share',
    SHOW_CHART = 'show_chart',
    VIEW_HEADLINE = 'view_headline',
    VISIBILITY_OFF = 'visibility_off',
    VPN_KEY = 'vpn_key',
    WHATSHOT = 'whatshot',
}

export interface IIconProps {
    className?: string;
    icon: EIcon;
    onClick?: {(): void};
    spinning?: boolean;
    style?: any;
    tooltipText?: string;
}

export class Icon extends React.PureComponent<IIconProps, {}> {
    constructor (props: IIconProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick (): void {
        if (this.props.onClick) {
            this.props.onClick();
        }
    }

    render () {
        let className = Common.getClassName('stk-icon', this.props.className);

        let style = undefined;
        if (this.props.style) {
            style = this.props.style;
        }
        if (this.props.spinning === true) {
            className += ' stk-icon-spinning';
        }
        let icon = (<span className={className} style={style} onClick={this.handleClick}>{this.props.icon}</span>);

        if (this.props.tooltipText) {
            icon = (<Tooltip text={this.props.tooltipText}>{icon}</Tooltip>);
        }
        return icon;
    }
}
