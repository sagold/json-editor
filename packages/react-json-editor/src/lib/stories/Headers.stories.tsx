import { ComponentStory } from '@storybook/react';
import { data, schema } from './data/layout';
import { Button, Header, Accordion, Icon, Segment, Grid } from 'semantic-ui-react';
// import '../styles.scss';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Components',
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {
        data: { control: { type: 'object' }, defaultValue: data },
        schema: { control: { type: 'object' }, defaultValue: schema }
    }
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<any> = ({ data, schema }) => {
    return (
        <div>
            header
            <Segment.Group horizontal>
                <Segment basic>
                    <Header as="h2">
                        <Header.Content>header content</Header.Content>
                    </Header>
                </Segment>
                <Segment textAlign="right">
                    <Button icon="add" />
                    <Button icon="edit" />
                </Segment>
            </Segment.Group>
            header with icon
            <Segment.Group horizontal>
                <Segment basic>
                    <Header as="h2">
                        <Icon name="dropdown" />
                        <Header.Content>header content</Header.Content>
                    </Header>
                </Segment>
                <Segment textAlign="right">
                    <Button icon="add" />
                    <Button icon="edit" />
                </Segment>
            </Segment.Group>
            header in Accordion
            <Accordion>
                <Segment.Group horizontal>
                    <Segment basic>
                        <Header as="h2">
                            <Accordion.Title>
                                <Icon name="dropdown" />
                                <Header.Content>header content</Header.Content>
                            </Accordion.Title>
                        </Header>
                    </Segment>
                    <Segment textAlign="right">
                        <Button icon="add" />
                        <Button icon="edit" />
                    </Segment>
                </Segment.Group>
            </Accordion>
            grid Header
            <Grid>
                <Grid.Column width="15">
                    <Header as="h2">
                        <Header.Content>header content</Header.Content>
                    </Header>
                </Grid.Column>
                <Grid.Column width="1">
                    <Button.Group>
                        <Button icon="add" />
                        <Button icon="edit" />
                    </Button.Group>
                </Grid.Column>
            </Grid>
            grid Header and accordion
            <Accordion>
                <Grid>
                    <Grid.Column width="15">
                        <Header as="h2">
                            <Accordion.Title>
                                <Icon name="dropdown" />
                                <Header.Content>header content</Header.Content>
                            </Accordion.Title>
                        </Header>
                    </Grid.Column>
                    <Grid.Column width="1">
                        <Button.Group>
                            <Button icon="add" />
                            <Button icon="edit" />
                        </Button.Group>
                    </Grid.Column>
                </Grid>
            </Accordion>
        </div>
    );
};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
export const Headers = Template.bind({});
