print "Welcom to the Pig Latin Translator!"
pyg = "ay"
name = raw_input("What is your name?")
if len(name) > 0 and name.isalpha():
	word = name.lower()
	first = name[0]
	new_word = word + first + name
	new_word = new_word[1:len(new_word)]
	print new_word
else:
	print "empty"
