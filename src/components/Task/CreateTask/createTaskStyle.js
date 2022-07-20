import {StyleSheet} from 'react-native';
import appTheme from '../../../constants/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 40,
  },
  textInput: {
    height: 40,
    width: '90%',
    borderRadius: 5,
    borderColor: appTheme.INACTIVE_COLOR,
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 16,
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
  todoInput: {
    height: 40,
    width: '90%',
    borderRadius: 5,
    borderColor: appTheme.INACTIVE_COLOR,
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 16,
    paddingHorizontal: 7,
    marginTop: 20
  },
  teamTextWrapper: {
    width: '90%', 
    marginBottom: 10,
    marginTop: 12
  },
  teamText: {
    fontSize: 16,
    color: 'gray',
    paddingLeft: 7,
  },
  btnWrapper: {
    marginTop: 'auto',
    height: 45,
    backgroundColor: appTheme.PRIMARY_COLOR,
    width: '90%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
    alignSelf: 'center'
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  teamSection: {height: 150, width: '90%'},
  teamWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activeTeamWrapper: {
    backgroundColor: appTheme.INACTIVE_COLOR,
  },
  memberWrapper: {
    width: '23%',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 2.5
  },
  memberPhoto: {height: 40, width: 40, borderRadius: 50},
  memberName: {width: 60, textAlign: 'center', color: '#000', fontSize: 13},
  activeMemberName: {color: '#fff'},
  flatListContainer: {height: 300, width: '90%'},
  todoscontainer: {borderWidth: 1, borderColor: '#a6a6a6', height: 50, justifyContent: 'center', borderRadius: 10, paddingLeft: 5}
});

export default styles;
