### Export data from mongodb with:
mongoexport --host localhost --db ceres_db --collection devicestream --csv --out text.csv --fields name,published_at,data
