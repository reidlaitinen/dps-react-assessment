import React from 'react';
import axios from 'axios';
import _ from 'lodash';
import {
  Header,
  List,
  Grid,
  Segment,
  Table,
  Divider,
  Image,
  Modal,
  Icon,
  Input,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

class Beers extends React.Component {

  state = { 
    searching: false, 
    resultsOrAll: 'All Beers', 
    visible: [], 
    searchValue: '', 
    page: 1, 
    totalPages: 0, 
    modalOpen: false, 
    modalBeer: {} }

  getFirstPage() {
    axios.get(`/api/all_beers?per_page=${10}`)
      .then((res) => {this.setState({ totalPages: res.data.total_pages, visible: res.data.entries }) })
  }

  componentDidMount() {
    this.getFirstPage()
  }

  loadMore = () => {
    const page = this.state.page + 1;
    if (this.state.searching === false) {
      axios.get(`/api/all_beers?page=${page}&per_page=${10}`)
      .then(res => { this.setState(
        { visible: [...this.state.visible, ...res.data.entries],
          page: this.state.page + 1,
        }
        );
      });
    } else {
      axios.get(`/api/search_beers?query=${this.state.searchValue}&page=${page}`)
      .then(res => {this.setState(
        { visible: [...this.state.visible, ...res.data.entries],
          page: this.state.page + 1,
        }
      )})
    }
  }

  toggleModal = (beer = {}) => {
    this.setState( state => {
      return { modalOpen: !this.state.modalOpen, modalBeer: beer }
    })
  }

  getAbv = (entry) => {
    if (!entry.hasOwnProperty('abv')) {
      if(!entry.hasOwnProperty('style.abv_min') || !entry.hasOwnProperty('style.abv_max')) 
        return "N/A"
      else
        return `~${(parseFloat(entry.style.abv_min) + parseFloat(entry.style.abv_max) / 2).toFixed(2)}`
    } else {
      return (entry.abv)
    }
  }

  resetSearch = () => {
    this.setState({ searching: false, page: 1, visible: [], value: '', resultsOrAll: 'All Beers' });
    this.getFirstPage();
  }

  handleSearchChange = (e) => {
    this.setState({ searchValue: e.target.value })

    if (this.state.searchValue.length < 1)
      this.resetSearch()

    if (this.state.searchValue.length >= 3) {
      this.setState({ resultsOrAll: 'Search Results', searching: true })
      axios.get(`/api/search_beers?query=${this.state.searchValue}`)
        .then( res =>  this.setState({ visible: res.data.entries})
        )
      }
  }

  render() {
    let open = {}
    if (this.state.modalOpen) 
      open = { open: true }
    
    const { resultsOrAll, visible, searchValue, results, isLoading, page, totalPages, modalBeer } = this.state

    return (
      <div>
        <Modal dimmer='blurring' style={styles.modal} {...open} onClose={() => this.toggleModal()}>
          <Modal.Header>BEER INFO</Modal.Header>
          <Modal.Content image scrolling>
          {modalBeer.labels ? 
            <Image
              size='large'
              src={modalBeer.labels.medium}
            />
          :
            <Icon name='beer' size='massive'/>
          }
            <Modal.Description>
              <Header>{modalBeer.name_display}</Header>
              {modalBeer.hasOwnProperty('style')
                ? <Header as='h4'>{modalBeer.style.name}</Header> 
                : <Header as='h4'><i>no style indicated</i></Header>
              }
              {modalBeer.hasOwnProperty('style')
                ? <p>{modalBeer.style.description}</p> 
                : <p><i>no description</i></p>
              }
              {modalBeer.hasOwnProperty('style')
                ? <h5 style={styles.numbers}>ABV: {this.getAbv(this.state.modalBeer)}, IBU min/max: {modalBeer.style.ibu_min}/{modalBeer.style.ibu_max}</h5>
                : <h5 style={styles.numbers}>ABV/IBU info not present</h5>
              }
            </Modal.Description>
          </Modal.Content>
        </Modal>
      <div>
        <Grid>
          <Grid.Column width={4}>
            <Input 
              size='small'
              icon='search' 
              placeholder='Search...' 
              onChange={this.handleSearchChange}
              value={this.state.searchValue}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <Header style={styles.mastHead}>{resultsOrAll}</Header>
          </Grid.Column>
          <Grid.Column width={4}>
          </Grid.Column>
        </Grid>
        <Divider hidden />
        <Grid>
          <Grid.Column>
            <Table>
              <Table.Header>
                <Table.HeaderCell>Label</Table.HeaderCell>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell textAlign='center'>Style</Table.HeaderCell>
                <Table.HeaderCell textAlign='right'>ABV</Table.HeaderCell>
              </Table.Header>
            </Table>
              <div style={styles.scroller}>
                <InfiniteScroll
                  pageStart={page}
                  loadMore={this.loadMore}
                  hasMore={page < totalPages}
                  useWindow={false}
                >
                <Table striped>
                  <Table.Body>
                    {visible.map( entry => (   
                    <Table.Row key={entry.id} style={styles.pointer} onClick={ () => this.toggleModal(entry)}>
                      <Table.Cell>
                        {entry.hasOwnProperty('labels') ? <Image src={entry.labels.icon} /> : <Icon name='beer' size='huge'/>}
                      </Table.Cell>
                      <Table.Cell verticalAlign='middle'>{entry.name_display}</Table.Cell>
                      {entry.hasOwnProperty('style') ? 
                        <Table.Cell verticalAlign='middle'>{entry.style.name}</Table.Cell>
                        :
                        <Table.Cell disabled verticalAlign='middle'>No data</Table.Cell>
                      }
                      <Table.Cell verticalAlign='middle'>{this.getAbv(entry)} %</Table.Cell>
                    </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </InfiniteScroll>
              <Table>
                <Table.Footer>
                  <Table.Cell>Scroll for more</Table.Cell>
                </Table.Footer>
              </Table>
            </div>
          </Grid.Column>
        </Grid>
      </div>
    </div>
    )
  }
}

const styles = {
  mastHead: {
    textAlign: 'center'
  },
  scroller: {
    height: '70vh',
    overflow: 'auto'
  },
  pointer: {
    cursor: 'pointer'
  },
  modal : {
    marginTop: '0px !important',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  numbers : {
    fontStyle: 'italic',
    fontWeight: 'lighter',
  }
}

export default Beers;