import sortBy from 'lodash/sortBy';
import React from 'react';
import Time from 'components/Time';
import TimeInput from 'react-time-input';
import styles from 'components/PropertyEditor/PropertyEditor.module.scss';
import Icon from 'components/Icon';

export default class ChapterConfig extends React.Component {
  state = {
    addingChapter: false
  };

  showAddChapter = () => this.setState({addingChapter: true});

  handleAddChapter = chapter => {
    const {addChapter, nodeId} = this.props;
    this.props.addChapter(nodeId, chapter);
    this.setState({addingChapter: false});
  };

  render() {
    let {nodeId, chapters} = this.props;
    const {addingChapter} = this.state;

    // TODO: this is bad place to do this but works for now
    chapters = sortBy(chapters, 'time');

    return (
      <div className={styles.option}>
        {chapters.map(chapter => <Chapter key={chapter.id} {...chapter} />)}
        {addingChapter && <AddChapter addChapter={this.handleAddChapter} />}
        <div className={styles.addChapter} onClick={this.showAddChapter}>
          <Icon name="plus" /> Add a chapter
        </div>
      </div>
    );
  }
}

const Chapter = ({time, name}) => (
  <div>
    <Time s={time} /> {name}
  </div>
);

class AddChapter extends React.Component {
  state = {
    name: '',
    time: ''
  };

  changeHandler = name => e => {
    let val = e;
    if (e.target) {
      val = e.target.value;
    }
    this.setState({[name]: val});
  };

  handleChangeTime = e => {
    this.setState({time: secondsForTime(e)});
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.addChapter(this.state);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className={styles.addChapterForm}>
        <TimeInput
          onTimeChange={this.handleChangeTime}
          className={styles.addChapterFormTime}
          placeholder="00:10"
        />
        <input
          type="text"
          onChange={this.changeHandler('name')}
          className={styles.addChapterFormName}
          placeholder="Chapter One"
        />
        <button type="submit" className={styles.addChapterSubmit}>
          Add
        </button>
      </form>
    );
  }
}

function secondsForTime(timeString) {
  const [m, s] = timeString.split(':').map(str => parseInt(str, 10));
  return m * 60 + s;
}
