import './common.css';

export enum Margin {
    None = 'none',
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
    ULarge = 'ularge',
    XLarge = 'xlarge'
}

export enum Padding {
    None = 'none',
    Small = 'small',
    Medium = 'medium',
    Large = 'large',
    ULarge = 'ularge',
    XLarge = 'xlarge'
}

export enum EStyle {
    ERROR = 'error',
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    SUCCESS = 'success',
    WARNING = 'warning',
}

export enum EIntent {
    ERROR = 'error',
    PRIMARY = 'primary',
    SUCCESS = 'success',
    WARNING = 'warning',
}

export function getStyleClass (style?: EStyle, defaultStyle: EStyle = EStyle.PRIMARY): string {
    let clsName = '';

    if (style) {
    } else {
        style = defaultStyle;
    }

    switch (style) {
        case EStyle.ERROR:
            clsName = 'stk-style-error';
            break;

        case EStyle.PRIMARY:
            clsName = 'stk-style-primary';
            break;

        case EStyle.SECONDARY:
            clsName = 'stk-style-secondary';
            break;

        case EStyle.SUCCESS:
            clsName = 'stk-style-success';
            break;

        case EStyle.WARNING:
            clsName = 'stk-style-warning';
            break;            
    }

    return clsName;
}

export function getMarginClass (margin?: Margin, defaultMargin :Margin = Margin.Medium): string {
    let clsName = '';

    if (margin) {
    } else {
        margin = defaultMargin;
    }

    switch (margin) {
        case Margin.None:
            clsName = 'stk-margin-none';
            break;

        case Margin.Small:
            clsName = 'stk-margin-small';
            break;

        case Margin.Medium:
            clsName = 'stk-margin-medium';
            break;

        case Margin.Large:
            clsName = 'stk-margin-large';
            break;

        case Margin.ULarge:
            clsName = 'stk-margin-ularge';
            break;  

        case Margin.XLarge:
            clsName = 'stk-margin-xlarge';
            break;              
    }

    return clsName;
}

export function getClassName (defaultClassName: string, classNameProp?: string): string {
    let cls = defaultClassName;
    if (classNameProp) {
        cls = classNameProp + ' ' + defaultClassName;
    }
    return cls;
}

export function getPaddingClass (padding?: Padding, defaultPadding :Padding = Padding.Large): string {
    let clsName = '';

    if (padding) {
    } else {
        padding = defaultPadding;
    }

    switch (padding) {
        case Padding.None:
            clsName = 'stk-padding-none';
            break;

        case Padding.Small:
            clsName = 'stk-padding-small';
            break;

        case Padding.Medium:
            clsName = 'stk-padding-medium';
            break;

        case Padding.Large:
            clsName = 'stk-padding-large';
            break;

        case Padding.ULarge:
            clsName = 'stk-padding-ularge';
            break;  

        case Padding.XLarge:
            clsName = 'stk-padding-xlarge';
            break;      
    }
    return clsName;
}