const en_dict = {
	hello: "hello {{ name }}, how are you?",
	goodbye: (name: string) => `goodbye ${name}`,
	food: {
		meat: "meat",
		fruit: "fruit",
	},
};

type Dict = typeof en_dict;

const fr_dict: Dict = {
	hello: "bonjour {{ name }}, comment vas-tu ?",
	goodbye: (name: string) => `au revoir ${name}`,
	food: {
		meat: "viande",
		fruit: "fruit",
	},
};
