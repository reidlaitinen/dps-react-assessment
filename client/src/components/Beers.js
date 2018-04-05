import React from 'react';
import axios from 'axios';
import {
  Header,
  List,
  Grid,
  Segment,
  Table,
  Divider,
  Image,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

class Beers extends React.Component {

  state = { visible: [], page: 1, totalPages: 0 }

  componentDidMount() {
    axios.get(`/api/all_beers?per_page=${10}`).then((res) => {this.setState({ visible: res.data.entries }) })
  }

  render() {
    const { visible } = this.state
    return (
      <div>
        <Header style={styles.masthead}>All Beers</Header>
        <Divider hidden />
        <Grid>
          <Grid.Column>
            <Table centered striped>
              <Table.Header>
                <Table.HeaderCell>Icon</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Style</Table.HeaderCell>
                <Table.HeaderCell>ABV</Table.HeaderCell>
              </Table.Header>
              <Table.Body>
                {visible.map( entry => (   
                  <Table.Row>
                    <Table.Cell>
                      {entry.hasOwnProperty('labels') && <Image src={entry.labels.icon} />}
                    </Table.Cell>
                    <Table.Cell>{entry.name_display}</Table.Cell>
                    <Table.Cell>{entry.style.name}</Table.Cell>
                    <Table.Cell>{entry.abv} %</Table.Cell>
                  </Table.Row>
                  )
                )}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

const styles = {
  masthead: {
    textAlign: 'center'
  }
}

export default Beers;