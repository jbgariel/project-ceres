### Export data from mongodb with:
mongoexport --host localhost --db ceres_db --collection devicestream --csv --out text.csv --fields name,published_at,data

### Automatic detection of light comportment:
- Blue: nigth light
- Green: natural light
- Red: artificial light

![alt tag](https://raw.githubusercontent.com/jbgariel/project-ceres/master/data_exploration/result_plot.png)




