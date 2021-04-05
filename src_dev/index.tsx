import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Button, ButtonBar} from '../src/button';
import {Box, BoxHeading, BoxBody, BoxFooter} from '../src/box';
import {CardDeck, Card, CardTitle, CardBody, CardBodyIcon, CardFooter} from '../src/card';
import {Callout} from '../src/callout';
import * as Common from '../src/common';
import {Data, DataCell, DataRow} from '../src/data';
import {DayPicker, DayRangePicker, RelativeDate} from '../src/date';
import {HFlex, VFlex} from '../src/flex';
import {FormCheckBox, FormControl, FormList, IFormListItem, FormTextSuggest, FormSmartText} from '../src/form';
import {EIcon, Icon} from '../src/icon';
import {Page, PageBody, Row, Col} from '../src/page';
import {Popover, EPosition, ETrigger} from '../src/popover';
import {Progress} from '../src/progress';
import {Tree, TreeNode} from '../src/tree';
import {Menu, MenuItem} from '../src/menu';
import {Spinner} from '../src/spinner';
import {Spreadsheet, SpreadsheetColumn} from '../src/spreadsheet';
import {Tag, TagList} from '../src/tag';
import {Timeline, TimelineItem, TimelineItemHeader, TimelineItemBody} from '../src/timeline';
import {Tooltip} from '../src/tooltip';
import './index.css'


class FormExamples extends React.PureComponent<{}, {}> {

    getSuggestedItems (itemCount: number): any {
        let suggestions = [];
        for (let i = 0; i < itemCount; ++i) {
            suggestions.push({
                key: i.toString(),
                value: '#' + i.toString() + ' suggestion that could be super long, and more if you really ask'
            })
        }
        return suggestions;
    }

    getListItems (): IFormListItem[] {
        return [
            {
                id: [1, "Complexe"],
                text: "Carotte"
            },
            {
                id: [2, "Complexe"],
                text: "Poireau",
            },
            {
                id: [3, "Complexe"],
                text: "Navet",
            }
        ];
    }
    render () {
        return (
            <Box>
                <BoxHeading><h2><strong>Form</strong></h2></BoxHeading>
                <BoxBody fullHeight verticalScroll>
                    <h3>CheckBox</h3>
                    <FormCheckBox label="This is a checkbox" />

                    <h3>FormSmartText</h3>
                    <h4>Simple</h4>
                    <FormSmartText value="Any value" />

                    <h4>Place holder</h4>
                    <FormSmartText placeholder="Type any text" />

                    <h4>Icon</h4>
                    <FormSmartText icon={EIcon.INBOX} value="Inbox name" />

                    <h4>Icon button</h4>
                    <FormSmartText buttonIcon={EIcon.DELETE} buttonToolip="Click me!" onButtonClick={() => alert('Clicked!')} />

                    <h4>Error</h4>
                    <FormSmartText value="Wrong value" error="Unexpected value" />

                    <h4>With button on the side</h4>
                    <HFlex>
                        <FormSmartText placeholder="Type a folder name" />
                        <ButtonBar>
                            <Button secondary icon={EIcon.CREATE_NEW_FOLDER} />
                            <Button secondary icon={EIcon.DELETE} />
                        </ButtonBar>
                    </HFlex>
                    <h3>FormTextSuggest</h3>
                    <h4>Classic</h4>
                    <FormTextSuggest items={this.getSuggestedItems(5)} itemValueKey="value" />

                    <h4>Many suggestions</h4>
                    <FormTextSuggest items={this.getSuggestedItems(50)} itemValueKey="value" />

                    <h4>With error</h4>
                    <FormTextSuggest items={this.getSuggestedItems(50)} itemValueKey="value" error="Are you sure?" />

                    <h3>List</h3>
                    <h4>Single selection</h4>
                    <FormList items={this.getListItems()} style={{height:'220px'}} value={[[1, "Complexe"], [3, "Complexe"]]} />

                    <h4>Multi selection</h4>
                    <FormList items={this.getListItems()} style={{height:'220px'}} value={[[1, "Complexe"], [3, "Complexe"]]} enableMultiSelection />
                </BoxBody>
            </Box>
        );
    }
}


class TimelineExamples extends React.PureComponent<{}, {}> {
    render (): React.ReactNode {
        return (
            <Box>
                <BoxHeading><h2><strong>Timeline</strong></h2></BoxHeading>
                <BoxBody fullHeight>
                    <Timeline>
                        <TimelineItem>
                            <TimelineItemHeader>This is an header</TimelineItemHeader>
                            <TimelineItemBody>This is a body</TimelineItemBody>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineItemHeader>Only an header, and no body</TimelineItemHeader>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineItemHeader>Lorem ipsum</TimelineItemHeader>
                            <TimelineItemBody>Phasellus tempor ligula magna. In ac metus porttitor, tincidunt magna id, efficitur augue. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Maecenas nec turpis mi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque et risus dui. Vivamus accumsan diam gravida, dictum neque blandit, mollis ligula.</TimelineItemBody>
                        </TimelineItem>
                        
                        <TimelineItem>
                            <TimelineItemHeader icon={EIcon.FACE}>Only an header, but with a  icon</TimelineItemHeader>
                        </TimelineItem>
                    </Timeline>
                </BoxBody>
            </Box>
        );
    }
}

class TooltipExamples extends React.PureComponent<{}, {}> {
    render (): React.ReactNode {
        return (
            <Box>
                <BoxHeading><h2><strong>Popover</strong></h2></BoxHeading>
                <BoxBody fullHeight>
                    <h3>Position top</h3>

                    <Row>
                        <Tooltip position={EPosition.TOP_RIGHT} text="Top right">
                            <Button secondary>Top right</Button>
                        </Tooltip>

                        <Tooltip position={EPosition.TOP_CENTER} text="Top center">
                            <Button secondary>Top center</Button>
                        </Tooltip>

                        <Tooltip position={EPosition.TOP_LEFT} text="Top left">
                            <Button secondary>Top left</Button>
                        </Tooltip>
                    </Row>

                    <h3>Position horizontal</h3>
                    <Row>
                        <Tooltip position={EPosition.LEFT} text="Left">
                            <Button secondary>Left</Button>
                        </Tooltip>

                        <Tooltip position={EPosition.RIGHT} text="Right">
                            <Button secondary>Right</Button>
                        </Tooltip>
                    </Row>

                    <h3>Position bottom</h3>
                    <Row>
                        <Tooltip position={EPosition.BOTTOM_RIGHT} text="Bottom right">
                            <Button secondary>Bottom right</Button>
                        </Tooltip>

                        <Tooltip position={EPosition.BOTTOM_CENTER} text="Bottom center">
                            <Button secondary>Bottom center</Button>
                        </Tooltip>

                        <Tooltip position={EPosition.BOTTOM_LEFT} text="Bottom left">
                            <Button secondary>Bottom left</Button>
                        </Tooltip>
                    </Row>
                </BoxBody>
            </Box>
        );
    }
}

class TreeExamples extends React.PureComponent<{}, {}> {
    render (): React.ReactNode {
        return (
            <Box>
                <BoxHeading><h2><strong>Tree</strong></h2></BoxHeading>
                <BoxBody fullHeight>
                    <Tree>
                        <TreeNode label="Node">
                            <TreeNode label="Child" icon={EIcon.FACE} selected secondaryLabel="FACE" />
                            <TreeNode label="Selectable" selectable icon={EIcon.PLACE} secondaryLabel="PLACE" />
                        </TreeNode>
                        <TreeNode label="Collapsed" expanded={false}>
                            <TreeNode label="Child" />
                            <TreeNode label="Child" />
                        </TreeNode>
                    </Tree>
                </BoxBody>
            </Box>
        );
    }
}

class PopoverExamples extends React.PureComponent<{}, {}> {
    render () {
        let menu = (
            <Menu>
                <MenuItem key="1" text="Cloud off" icon={EIcon.CLOUD_OFF} />
                <MenuItem key="2" text="Send" icon={EIcon.SEND} />
            </Menu>
        );

        return (
            <Box>
                <BoxHeading><h2><strong>Popover</strong></h2></BoxHeading>
                <BoxBody fullHeight>
                    <h3>Position top</h3>

                    <Row>
                        <Popover position={EPosition.TOP_RIGHT} trigger={ETrigger.CLICK}>
                            <Button secondary>Top right</Button>
                            {menu}
                        </Popover>

                        <Popover position={EPosition.TOP_CENTER} trigger={ETrigger.CLICK}>
                            <Button secondary>Top center</Button>
                            {menu}
                        </Popover>

                        <Popover position={EPosition.TOP_LEFT} trigger={ETrigger.CLICK}>
                            <Button secondary>Top left</Button>
                            {menu}
                        </Popover>
                    </Row>

                    <h3>Position horizontal</h3>
                    <Row>
                        <Popover position={EPosition.LEFT} trigger={ETrigger.CLICK}>
                            <Button secondary>Left</Button>
                            {menu}
                        </Popover>

                        <Popover position={EPosition.RIGHT} trigger={ETrigger.CLICK}>
                            <Button secondary>Right</Button>
                            {menu}
                        </Popover>
                    </Row>

                    <h3>Position bottom</h3>
                    <Row>
                        <Popover position={EPosition.BOTTOM_RIGHT} trigger={ETrigger.CLICK}>
                            <Button secondary>Bottom right</Button>
                            {menu}
                        </Popover>

                        <Popover position={EPosition.BOTTOM_CENTER} trigger={ETrigger.CLICK}>
                            <Button secondary>Bottom center</Button>
                            {menu}
                        </Popover>

                        <Popover position={EPosition.BOTTOM_LEFT} trigger={ETrigger.CLICK}>
                            <Button secondary>Bottom left</Button>
                            {menu}
                        </Popover>
                    </Row>
                </BoxBody>
            </Box>
        );
    }
}


class ProgressExamples extends React.PureComponent<{}, {}> {
    render (): React.ReactNode {
        return (
            <Box>
                <BoxHeading>
                    <h2><strong>Progress</strong></h2>
                    <Tooltip text="With tooltip!"><Progress value={0.25} /></Tooltip>
                </BoxHeading>
                <BoxBody fullHeight>
                    <p><Progress value={1} /></p>
                    <p><Progress value={0.75} /></p>
                    <p><Progress value={0.5} /></p>
                    <p><Progress value={0.25} /></p>
                    <p><Progress value={0} /></p>
                </BoxBody>
            </Box>
        );
    }
}

class DateExamples extends React.PureComponent<{}, {}> {

    render () {
        let today = new Date();
        let yesterday = new Date();
        yesterday.setDate(new Date().getDate() - 1);
        let sixDaysAgo = new Date();
        sixDaysAgo.setDate(new Date().getDate() - 6);
        let sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(new Date().getDate() - 7);
        let longAgo = new Date(2012, 3, 30);

        return (
            <Box>
                <BoxHeading><h2><strong>Date / Time</strong></h2></BoxHeading>
                <BoxBody fullHeight>
                    <h3>Day picker</h3>

                    <h4>Without day</h4>
                    <DayPicker />
                   
                    <h4>Withday</h4>
                    <DayPicker value={new Date(2019, 1, 1)} />

                    <h3>Day range picker</h3>
                    <DayRangePicker />

                    <h3>Relative date</h3>
                    <Data>
                        <DataRow>
                            <DataCell size={2}>When</DataCell>
                            <DataCell size={5}>Date</DataCell>
                            <DataCell size={5}>Output</DataCell>
                        </DataRow>
                        <DataRow>
                            <DataCell size={2}>Today</DataCell>
                            <DataCell size={5}>{today.toString()}</DataCell>
                            <DataCell size={5}><RelativeDate date={today} /></DataCell>
                        </DataRow>
                        <DataRow>
                            <DataCell size={2}>Yesterday</DataCell>
                            <DataCell size={5}>{yesterday.toString()}</DataCell>
                            <DataCell size={5}><RelativeDate date={yesterday} /></DataCell>
                        </DataRow>
                        <DataRow>
                            <DataCell size={2}>6 days ago</DataCell>
                            <DataCell size={5}>{sixDaysAgo.toString()}</DataCell>
                            <DataCell size={5}><RelativeDate date={sixDaysAgo} /></DataCell>
                        </DataRow>
                        <DataRow>
                            <DataCell size={2}>7 days ago</DataCell>
                            <DataCell size={5}>{sevenDaysAgo.toString()}</DataCell>
                            <DataCell size={5}><RelativeDate date={sevenDaysAgo} /></DataCell>
                        </DataRow>
                        <DataRow>
                            <DataCell size={2}>April, 30th 2012</DataCell>
                            <DataCell size={5}>{longAgo.toString()}</DataCell>
                            <DataCell size={5}><RelativeDate date={longAgo} /></DataCell>
                        </DataRow>
                    </Data>
                </BoxBody>
            </Box>
        );
    }
}

class CalloutExamples extends React.PureComponent<{}, {}> {
    render () {
        return (
            <Box>
                <BoxHeading><h2><strong>Callouts</strong></h2></BoxHeading>
                <BoxBody fullHeight>
                    <h3>Default</h3>
                    <Callout title="Lorem Ipsum" icon={EIcon.INFO} />

                    <Callout title="Lorem Ipsum" icon={EIcon.INFO_OUTLINE}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis non sapien aliquet facilisis. Quisque convallis gravida pharetra. Nunc vulputate eu neque ut posuere. Phasellus a elit facilisis, condimentum tellus id, sollicitudin velit. Nunc venenatis eget justo quis tincidunt. Nunc ut neque tellus. In commodo sem at finibus fermentum. Maecenas convallis purus id lacus egestas, id posuere eros varius. Integer vel eros nisi. Nam quis enim eros. Mauris felis sem, rhoncus eu condimentum et, pellentesque vitae mi. Nullam ac nulla pellentesque, facilisis nulla quis, sodales nisl. Praesent sodales velit id urna pellentesque, quis dignissim ante porttitor.
                    </Callout>

                    <h3>Warning</h3>
                    <Callout title="Lorem Ipsum" icon={EIcon.INFO} style={Common.EStyle.WARNING} />

                    <Callout title="Lorem Ipsum" icon={EIcon.INFO_OUTLINE} style={Common.EStyle.WARNING}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis non sapien aliquet facilisis. Quisque convallis gravida pharetra. Nunc vulputate eu neque ut posuere. Phasellus a elit facilisis, condimentum tellus id, sollicitudin velit. Nunc venenatis eget justo quis tincidunt. Nunc ut neque tellus. In commodo sem at finibus fermentum. Maecenas convallis purus id lacus egestas, id posuere eros varius. Integer vel eros nisi. Nam quis enim eros. Mauris felis sem, rhoncus eu condimentum et, pellentesque vitae mi. Nullam ac nulla pellentesque, facilisis nulla quis, sodales nisl. Praesent sodales velit id urna pellentesque, quis dignissim ante porttitor.
                    </Callout>

                    <h3>Error</h3>
                    <Callout title="Lorem Ipsum" icon={EIcon.INFO} style={Common.EStyle.ERROR} />

                    <Callout title="Lorem Ipsum" icon={EIcon.INFO_OUTLINE} style={Common.EStyle.ERROR}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis non sapien aliquet facilisis. Quisque convallis gravida pharetra. Nunc vulputate eu neque ut posuere. Phasellus a elit facilisis, condimentum tellus id, sollicitudin velit. Nunc venenatis eget justo quis tincidunt. Nunc ut neque tellus. In commodo sem at finibus fermentum. Maecenas convallis purus id lacus egestas, id posuere eros varius. Integer vel eros nisi. Nam quis enim eros. Mauris felis sem, rhoncus eu condimentum et, pellentesque vitae mi. Nullam ac nulla pellentesque, facilisis nulla quis, sodales nisl. Praesent sodales velit id urna pellentesque, quis dignissim ante porttitor.
                    </Callout>
                </BoxBody>
            </Box>
        );
    }
}

class SpinnerExamples extends React.PureComponent<{}, {}> {
    render () {
        return (
            <Box>
                <BoxHeading><h2><strong>Callouts</strong></h2></BoxHeading>
                <BoxBody fullHeight>
                    <h3>Spinner</h3>
                    <Spinner delay={0}/>
                    <Spinner delay={1000} />
                </BoxBody>
            </Box>
        );
    }
}

class ButtonExamples extends React.PureComponent<{}, {}> {
    render () {
        return (
            <Box>
                <BoxHeading><h2><strong>Buttons</strong></h2></BoxHeading>
                <BoxBody>
                    <h3>Primary</h3>
                    <h4>Some buttons</h4>
                    <Row>
                        <Button primary>Standard</Button>
                        <Button primary enabled={false}>Disabled</Button>
                        <Button primary loading>Loading</Button>

                        <ButtonBar>
                            <Button primary onClick={() => alert('Clicked')} icon={EIcon.FACE}>Button 1</Button>
                            <Button primary>Button 2</Button>
                            <Button primary onClick={() => alert('Clicked')} enabled={false}>Button 3 (disabled)</Button>
                            <Button primary>Button 4</Button>
                            <Button primary loading icon={EIcon.FACE}>Button 5 (loading)</Button>
                        </ButtonBar>

                        <ButtonBar>
                            <Button primary>Standard</Button>
                        </ButtonBar>
                    </Row>

                    <h3>Secondary</h3>
                    <Row>
                        <Button secondary>Standard</Button>
                        <Button secondary enabled={false}>Disabled</Button>
                        <Button secondary loading>Loading</Button>

                        <ButtonBar>
                            <Button secondary>Button 1</Button>
                            <Button secondary>Button 2</Button>
                            <Button secondary enabled={false}>Button 3 (disabled)</Button>
                            <Button secondary>Button 4</Button>
                            <Button secondary loading>Button 5 (loading)</Button>
                        </ButtonBar>
                    </Row>

                    <h3>Flat</h3>
                    <Row>
                        <Button flat>Standard</Button>
                        <Button flat enabled={false}>Disabled</Button>
                        <Button flat loading>Loading</Button>
                    </Row>

                    <h3>Stealth</h3>
                    <Row>
                        <Button stealth>Standard</Button>
                        <Button stealth enabled={false}>Disabled</Button>
                        <Button stealth loading>Loading</Button>
                    </Row>
                </BoxBody>
            </Box>
        );
    }
}


class IconExamples extends React.PureComponent<{}, {}> {
    render () {
        let icons = [];
        for (let item in EIcon) {
            if (isNaN(Number(item))) {
                icons.push((<Tooltip text={item}><Icon icon={EIcon[item]} /></Tooltip>));
            }
        }

        return (
            <Box>
                <BoxHeading><h2><strong>Icons</strong></h2></BoxHeading>
                <BoxBody>
                    <span style={{fontSize:'2em'}}>{icons}</span>
                </BoxBody>
            </Box>
        );
    }
}


class MenuExamples extends React.PureComponent<{}, {}> {
    render () {
        return (
            <Box>
                <BoxHeading><h2><strong>Buttons</strong></h2></BoxHeading>
                <BoxBody>
                    <Popover trigger={ETrigger.CLICK} position={EPosition.BOTTOM_LEFT} width="200px">
                        <Button secondary>Click me</Button>
                        <Menu>
                            <MenuItem key="1" icon={EIcon.FACE} text="Happy go lucky" />
                            <MenuItem key="2" text="Some text" />
                            <MenuItem key="2" text="This is too long of a text to fit, it should overflow" />
                        </Menu>
                    </Popover>

                </BoxBody>
            </Box>
        );
    }
}


class CardExamples extends React.PureComponent<{}, {}> {
    render () {
        return (
            <Box fullHeight>
                <BoxHeading><h2><strong>Cards</strong></h2></BoxHeading>
                <BoxBody withBackground>
                    <h3>Simple card deck</h3>
                    <CardDeck>
                        <Card width="300px" raisable>
                            <CardTitle><strong>This is a simple card</strong></CardTitle>
                            <CardBody padding={Common.Padding.Medium}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur auctor faucibus quam, sodales gravida magna consequat consequat. Nullam fermentum sollicitudin ligula quis iaculis. Fusce gravida rhoncus tortor id tincidunt.</CardBody>
                            <CardFooter><Button primary icon={EIcon.INFO}>Do something</Button></CardFooter>
                        </Card>
                        <Card width="300px" raisable>
                            <CardTitle><strong>Another one</strong></CardTitle>
                            <CardBody padding={Common.Padding.Medium}>blabla</CardBody>
                            <CardFooter>
                                <ButtonBar>
                                    <Button secondary icon={EIcon.OPEN_IN_BROWSER}>Do something</Button>
                                    <Button secondary icon={EIcon.SEARCH}>... or else !</Button>
                                </ButtonBar>
                            </CardFooter>
                        </Card>
                    </CardDeck>

                    <h3>Cards with icons</h3>
                    <CardDeck>
                        <Card width="300px" raisable>
                            <CardTitle><strong>This is a simple card</strong></CardTitle>
                            <CardFooter style={{fontSize:'8em'}}><Button primary icon={EIcon.INBOX} /></CardFooter>
                            <CardBody padding={Common.Padding.Medium}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur auctor faucibus quam, sodales gravida magna consequat consequat. Nullam fermentum sollicitudin ligula quis iaculis. Fusce gravida rhoncus tortor id tincidunt.</CardBody>
                        </Card>
                    </CardDeck>
                </BoxBody>
            </Box>
        );
    }
}


class TagExamples extends React.PureComponent<{}, {}> {
    render () {
        return (
            <Box>
                <BoxHeading><h2><strong>Tags</strong></h2></BoxHeading>
                <BoxBody>
                    <p>This is some text with a <Tag text="tag" /> inside.</p>
                    <p>You could also make a list: <TagList><Tag text="Tag1" /><Tag text="CLICKABLE" onClick={() => alert('Clicked!')}/><Tag text="Something, but longer" /><Tag text="With icon" icon={EIcon.FOLDER_OPEN} /></TagList></p>
                    <p>Tags can also be removable:
                        <TagList>
                            <Tag text="Remove me" onRemove={() => alert('Removed!')} removable={true} />
                            <Tag text="Click me then remove me" onClick={() => alert('Clicked!')} onRemove={() => alert('Removed!')} removable={true} />
                        </TagList>
                    </p>
                </BoxBody>
            </Box>
        );
    }
}

class SpreadsheetExamples extends React.PureComponent<{}, {}> {

    getNColumns (num: number): SpreadsheetColumn[] {
        let cols: SpreadsheetColumn[] = [];
        for (let i = 0; i < num; ++i) {
            cols.push(new SpreadsheetColumn("Col" + i.toString()));
        }
        return cols;
    }

    getNRows (numColumns: number, numRows: number): any[] {
        let rows: any[] = [];
        for (let iRow = 0; iRow < numRows; ++iRow) {
            let row: any = {};
            for (let iColumn = 0; iColumn < numColumns; ++iColumn) {
                row["Col" + iColumn.toString()] = iColumn.toString();
            }
            //console.log(row);
            rows.push(row);
        }
        
        return rows;
    }

    render () {
        let columns = [
            new SpreadsheetColumn('avis'),
            new SpreadsheetColumn('type', 3),
            new SpreadsheetColumn('article'),
        ];

        let rows = [
            {
                'article': 'D571.98765.200.01',
                'avis': 9872323,
                'type': 'AM',
            },
            {
                'article': 'D571.98765.200.01',
                'avis': 9872323,
                'type': 'BM',
            },
            {
                'article': 'D571.98765.200.01',
                'avis': 9872323,
                'type': 'CM',
            },
            {
                'article': 'D571.98765.200.01',
                'avis': 9872353,
                'type': 'AF',
            },
            {
                'article': 'D571.98765.200.01',
                'avis': 9872350,
                'type': 'AFFSDFDSFD',
            },
            {
                'article': 'D571.98765.200.01',
                'avis': 9872350,
                'type': 'CM',
            }

        ];

        return (
            <Box fullHeight>
                <BoxHeading><h2><strong>Spreadsheet</strong></h2></BoxHeading>
                <BoxBody>
                    <h3>Simple</h3>
                    <Spreadsheet filtrable={true} sortable={true} columns={columns} rows={rows} rowIndex={['avis']} />

                    <h3>Lots of data</h3>
                    <Spreadsheet height="300px" columns={this.getNColumns(50)} rows={this.getNRows(50, 30)} rowIndex={['Col0']} />
                </BoxBody>
            </Box>
        );
    }
}

interface TestAppState {
    tabId: string;
}

class TestApp extends React.PureComponent<{}, TestAppState> {

    constructor (props: {}) {
        super(props);

        this.state = {
            tabId: 'button'
        };
    }

    handleTabClick (tabId: string): void {
        this.setState({tabId: tabId});
    }

    render () {
        return (
            <Page title="STK : Symphonie Tool Kit">
                <PageBody>
                    <Row fullHeight>
                        <Col size={3}>
                            <Box>
                                <BoxHeading><h2>TOC</h2></BoxHeading>
                                <BoxBody>
                                    <Tree>
                                        {this.renderTabTitle('Buttons', 'button')}
                                        {this.renderTabTitle('Callouts', 'callout')}
                                        {this.renderTabTitle('Cards', 'card')}
                                        {this.renderTabTitle('Date / Time', 'datetime')}
                                        {this.renderTabTitle('Form', 'form')}
                                        {this.renderTabTitle('Icons', 'icon')}
                                        {this.renderTabTitle('Menu', 'menu')}
                                        {this.renderTabTitle('Popover', 'popover')}
                                        {this.renderTabTitle('Progress', 'progress')}
                                        {this.renderTabTitle('Spinner', 'spinner')}
                                        {this.renderTabTitle('Speadsheet', 'spreadsheet')}
                                        {this.renderTabTitle('Table', 'table')}
                                        {this.renderTabTitle('Tag', 'tag')}
                                        {this.renderTabTitle('Timeline', 'timeline')}
                                        {this.renderTabTitle('Tooltip', 'tooltip')}
                                        {this.renderTabTitle('Tree', 'tree')}
                                    </Tree>
                                </BoxBody>
                            </Box>
                        </Col>
                        <Col size={9}>
                            {this.renderTabContents(this.state.tabId)}
                        </Col>
                    </Row>
                </PageBody>
            </Page>
        );
    }

    renderTabTitle (title: string, id: string): React.ReactNode {
        return (
            <TreeNode label={title} onClick={() => this.handleTabClick(id)} selectable selected={this.state.tabId == id ? true : undefined} />
        );
    }

    renderTabContents (tabId: string): React.ReactNode {
        switch (tabId) {
            case 'callout': return (<CalloutExamples />);
            case 'button': return (<ButtonExamples />);
            case 'card': return (<CardExamples />);
            case 'datetime': return (<DateExamples />);
            case 'icon': return (<IconExamples />);
            case 'form': return (<FormExamples />);
            case 'menu': return (<MenuExamples />);
            case 'popover': return (<PopoverExamples />);
            case 'progress': return (<ProgressExamples />);
            case 'spinner': return (<SpinnerExamples />);
            case 'spreadsheet': return (<SpreadsheetExamples />);
            case 'tag': return (<TagExamples />);
            case 'timeline': return (<TimelineExamples />);
            case 'tooltip': return (<TooltipExamples />);
            case 'tree': return (<TreeExamples />);
            default: return null;
        }
    }
}

ReactDOM.render(React.createElement(TestApp), document.getElementById('body'));