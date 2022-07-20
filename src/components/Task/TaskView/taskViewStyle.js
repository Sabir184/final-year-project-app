import { StyleSheet } from 'react-native';
import appTheme from '../../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  taskProgressWrapper: { marginRight: 20 },
  taskProgress: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  taskTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  taskTeamText: { fontWeight: 'bold', marginBottom: 7, fontSize: 17 },
  taskMembersWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    marginBottom: 20,
  },
  taskMemberPhoto: {
    height: 45,
    width: 45,
    borderRadius: 50,
    marginLeft: -10,
  },
  plusBtnContainer: {
    backgroundColor: appTheme.COLOR1,
    height: 45,
    width: 45,
    borderRadius: 50,
    marginLeft: -10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scheduleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleText: { color: appTheme.INACTIVE_COLOR, marginLeft: 5 },
  longText: {
    height: 200,
    fontSize: 16,
    lineHeight: 22,
    color: appTheme.INACTIVE_COLOR,
  },
  bottomWrapper: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomText: {
    marginLeft: 10,
    color: appTheme.INACTIVE_COLOR,
  },
  todocontainer: {
    // borderWidth: 1,
    height: 45,
    justifyContent: 'center',
    paddingLeft: 12,
    borderRadius: 10,
    backgroundColor: '#fafafa',
    elevation: 2,
    marginHorizontal: 2
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
});

export default styles;
