import React from 'react';
import axios from 'axios';
import {
  Header,
  List,
  Grid,
  Divider,
  Image,
  Modal,
  Icon,
  Card,
  Input,
} from 'semantic-ui-react';
import InfiniteScroll from 'react-infinite-scroller';

class Breweries extends React.Component {

  state = { 
    searching: false, 
    searchValue: '', 
    resultsOrAll: 'All Breweries', 
    visible: [], 
    page: 1, 
    totalPages: 0, 
    modalOpen: false, 
    modalBrewery: {} }

  getFirstPage() {
    axios.get(`/api/all_breweries?page=${1}&per_page=${10}`)
      .then((res) => {this.setState({ totalPages: res.data.total_pages, visible: res.data.entries }) })
  }

  componentDidMount() {
    this.getFirstPage();
  }

  loadMore = () => {
    const page = this.state.page + 1;
    axios.get(`/api/all_breweries?page=${page}&per_page=${10}`)
    .then(res => { this.setState(
        { visible: [...this.state.visible, ...res.data.entries],
          page: this.state.page + 1,
        }
      );
    });
  }

  toggleModal = (brewery = {}) => {
    this.setState( state => {
      return { modalOpen: !this.state.modalOpen, modalBrewery: brewery }
    })
  }

  resetSearch = () => {
    this.setState({ searching: false, page: 1, visible: [], resultsOrAll: 'All Breweries' });
    this.getFirstPage();
  }

  handleSearchChange = (e) => {
    this.setState({ searchValue: e.target.value })

    if (this.state.searchValue.length < 1)
      this.resetSearch()

    if (this.state.searchValue.length >= 3) {
      this.setState({ resultsOrAll: 'Search Results', searching: true, visible: []})
      axios.get(`/api/search_breweries?query=${this.state.searchValue}`)
        .then( res =>  this.setState({ visible: res.data.entries})
        )
      }
  }

  render() {

    let open = {}
    if (this.state.modalOpen) 
      open = { open: true }
    
    const { searchValue, resultsOrAll, visible, page, totalPages, modalBrewery } = this.state

    return (
      <div>
        <Modal dimmer='blurring' style={styles.modal} {...open} onClose={() => this.toggleModal()}>
          <Modal.Header>BREWERY INFO</Modal.Header>
          <Modal.Content image scrolling>
          {modalBrewery.images ? 
            <Image
              size='large'
              src={modalBrewery.images.square_large}
            />
          :
            <Icon fitted name='beer'/>
          }
            <Modal.Description>
              <Header>{modalBrewery.name_short_display}</Header>
              {modalBrewery.hasOwnProperty('description')
                ? <p>{modalBrewery.description}</p> 
                : <p><i>no description</i></p>
              }
              {modalBrewery.hasOwnProperty('website')
                ? <a href={modalBrewery.website}><Header style={styles.weblink} as='h5'>Official Website</Header></a>
                : <Header as='h5'>(no website indicated)</Header>
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
              value={searchValue}
              onChange={this.handleSearchChange}
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
          <div style={styles.scroller}>
            <InfiniteScroll
              pageStart={page}
              loadMore={this.loadMore}
              hasMore={page < totalPages}
              useWindow={false}
            >
              <Card.Group itemsPerRow={5}>
                {visible.map( entry => (
                  <Card key={entry.id}>
                    {entry.hasOwnProperty('images') ?
                      <Image 
                        src={entry.images.square_medium}
                      />
                    :
                      <Icon
                        name='beer'
                        size='massive'
                      />
                    }
                    <Card.Content>
                      <Card.Header style={styles.pointer} onClick={ () => this.toggleModal(entry)}>
                        {entry.name_short_display}
                      </Card.Header>
                      <Card.Meta>
                        Est. {entry.established}
                      </Card.Meta>
                      <Card.Description>
                        {entry.description}
                      </Card.Description>
                    </Card.Content>
                  </Card>
                ))}
              </Card.Group>
            </InfiniteScroll>
          </div>
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
  },
  weblink: {
    color: 'blue',
    cursor: 'pointer',
    fontStyle: 'italic',
    fontWeight: 'lighter'
  }
}

export default Breweries;