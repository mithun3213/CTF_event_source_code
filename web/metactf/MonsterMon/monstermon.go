package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

type card struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Value       int64  `json:"value"`
}

type user struct {
	Name string `json:"name"`
	Card *card  `json:"card"`
}

var semaphore int = 0

var users []user

var ctf_user *user = &(user{Name: "User", Card: &card{Title: "Common Squirrel", Description: "Most common card there is...", Value: 35}})

func main() {
	loadData()
	router := gin.Default()
	router.StaticFile("/", "./index.html")
	router.StaticFile("/script.js", "./script.js")
	router.Static("/images", "./images")
	router.StaticFile("/style.css", "./style.css")
	router.GET("/inspect", inspect)
	router.GET("/trade/:user", tradeCards)
	router.GET("/diff/:user", calculateDiff)
	router.Run("0.0.0.0:8080")
}

func calculateDiff(c *gin.Context) {
	username := c.Param("user")
	u := findUserByName(username)
	if u == nil {
		c.IndentedJSON(http.StatusAccepted, gin.H{"message": "user not found"})
		return
	}
	diff := u.Card.Value - ctf_user.Card.Value
	c.IndentedJSON(http.StatusAccepted, gin.H{"diff": diff})
}

func loadData() {
	byteValue, _ := os.ReadFile("data.json")
	json.Unmarshal(byteValue, &users)
	flag, _ := os.ReadFile("flag.txt")
	u := findUserByName("FuzzyFlash23")
	u.Card.Description = string(flag)
}

func tradeCards(c *gin.Context) {
	username := c.Param("user")
	u := findUserByName(username)
	if u == nil {
		c.IndentedJSON(http.StatusAccepted, gin.H{"message": "user not found"})
		return
	}
	if u.Card.Value-ctf_user.Card.Value < 25 {
		go thinkAboutTrade(u)
		c.IndentedJSON(http.StatusAccepted, gin.H{"message": "Trade Processing"})
		return
	}
	c.IndentedJSON(http.StatusAccepted, gin.H{"message": "Trade Auto Rejected!!"})
}

func findUserByName(name string) *user {
	for i, u := range users {
		if u.Name == name {
			return &(users[i])
		}
	}
	return nil
}

func thinkAboutTrade(u *user) {
	semaphore++
	temp := ctf_user.Card
	ctf_user.Card = u.Card
	u.Card = temp
	fmt.Println("Thinking.......")
	time.Sleep(10 * time.Second)
	fmt.Println("Nevermind!")
	temp = ctf_user.Card
	ctf_user.Card = u.Card
	u.Card = temp
	semaphore--
}

func inspect(c *gin.Context) {
	if semaphore > 0 {
		c.IndentedJSON(http.StatusOK, gin.H{"message": "Trade in Process"})
		return
	}
	c.IndentedJSON(http.StatusOK, ctf_user.Card)
}
