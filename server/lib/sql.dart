import 'package:mysql1/mysql1.dart';



late MySqlConnection sqlcon;

void connect() async {
  var settings = new ConnectionSettings(
      host: '192.168.3.40',
      port: 3306,
      user: 'root',
      password: '1234',
      db: 'objcloud',
  );

  var sqlcon = await MySqlConnection.connect(settings);

  var results = await sqlcon.query('select * from t_files');
  var results2 = await sqlcon.query('select * from t_files');
  var results3 = await sqlcon.query('select * from t_user');
  var results4 = await sqlcon.query('select * from t_user');
  var results5 = await sqlcon.query('select * from t_file_type');
  var results6 = await sqlcon.query('select * from t_user');
  print(results);
}
