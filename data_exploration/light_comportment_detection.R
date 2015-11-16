# Test detection and breakout algorithm on ceres data
# Import library
library(ggplot2)
library(AnomalyDetection) # Twitter anomaly detection package
library(BreakoutDetection) # Twitter breakout detection package

# Import data
data <- read.delim("text.csv", sep = ",")
df.tmp <- data.frame(do.call('rbind', strsplit(as.character(data$data), ';', fixed = TRUE)))
colnames(df.tmp) <- c("light", "temperature", "moisture")
data <- cbind(subset(data, select = -c(data)), df.tmp)

# Clean data frame
data$name <- as.character(data$name)
data$published_at <- as.character(data$published_at)
data$light <- as.numeric(as.character(data$light))
data$temperature <- as.numeric(as.character(data$temperature))
data$moisture <- as.numeric(as.character(data$moisture))
data <- data[data$name == "dataStream",]

data.light <- subset(data, select = c(published_at, light))
data.light$published_at <- as.POSIXct(data.light$published_at, "%Y-%m-%dT%H:%M:%S", tz = "UTC")
colnames(data.light) <- c("timestamp", "count")

# Detect breakout algorithm
res.breakout = breakout(data.light, min.size = 2, method = 'multi',
                        beta = .05, degree = 5, plot = TRUE) 

# Plotline
## general plot
p <- ggplot(data.light, aes(x = timestamp, y = count))
p <- p + geom_line()
p <- p + ggtitle("Light time serie")
p <- p + theme(plot.title = element_text(lineheight = .8, face = "bold"))

## Add breakout detection layer
N <- ceiling(length(res.breakout$loc)/2)
for(i in 1:N){
  start_break <- 2*i-1
  stop_break <- 2*i #ifelse(N/2 == ceiling(N/2) & i==N, nrow(data.light), 2*i)
  
  p <- p + annotate("rect", xmin = data.light$timestamp[res.breakout$loc[start_break]],
                    xmax = data.light$timestamp[res.breakout$loc[stop_break]],
                    ymin = 0,
                    ymax = max(data.light$count)+10,
                    fill = "green",
                    alpha = .15)  
}
p

# Cut time serie
mini.ts <- list()
M <- length(res.breakout$loc)+1
for(i in 1:M){
  
  if(i == 1){
    start_break <- 0
  }else{
    start_break <- res.breakout$loc[i-1]
  }
  
  if(i == M){
    stop_break <- nrow(data.light)
  }else{
    stop_break <- res.breakout$loc[i]
  }
  
  mini.ts$data[[i]] <- data.light[start_break:stop_break,]
}

# Test
data.test <- mini.ts$data[[5]]

p <- ggplot(data.test, aes(x = timestamp, y = count))
p <- p + geom_line()
p <- p + ggtitle("Light time serie")
p <- p + theme(plot.title = element_text(lineheight = .8, face = "bold"))

p

# Class mini time series
## Categories :
## 1- night
## 2- day light
## 3- artificial light

### Dummy algorithm for classification
for(i in 1:length(mini.ts$data))
if(nrow(mini.ts$data[[i]][mini.ts$data[[i]]$count == 0,]) > nrow(mini.ts$data[[i]][mini.ts$data[[i]]$count != 0,])){
  mini.ts$class[[i]] <- 1
}else if(sd(mini.ts$data[[i]][mini.ts$data[[i]]$count < quantile(mini.ts$data[[i]]$count, 0.95) &
                                mini.ts$data[[i]]$count > quantile(mini.ts$data[[i]]$count, 0.05),]$count) > 150){
  mini.ts$class[[i]] <- 2
}else{
  mini.ts$class[[i]] <- 3
}

# Plot result with colors
p <- ggplot(data.light, aes(x = timestamp, y = count))
p <- p + geom_line()
p <- p + ggtitle("Light time serie")
p <- p + theme(plot.title = element_text(lineheight = .8, face = "bold"))

## Add breakout detection layer with colors
for(i in 1:length(mini.ts$class)){
  
  if(mini.ts$class[[i]] == 1) color <- "blue"
  if(mini.ts$class[[i]] == 2) color <- "green"
  if(mini.ts$class[[i]] == 3) color <- "red"
  
  p <- p + annotate("rect", xmin = mini.ts$data[[i]]$timestamp[1],
                    xmax = mini.ts$data[[i]]$timestamp[nrow(mini.ts$data[[i]])],
                    ymin = 0,
                    ymax = max(data.light$count)+10,
                    fill = color,
                    alpha = .15)  
}
p
