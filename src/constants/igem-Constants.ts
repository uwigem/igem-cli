export const LOGIN = {
	URL: "https://igem.org/Login2",
	USERNAME_GETTER: `#name_and_pass input[name="username"]`,
	PASSWORD_GETTER: `#name_and_pass input[name="password"]`,
	SUBMIT_GETTER: `input.submit`
};

export const HTTPS = "https://";
export const NEWPAGE = {
	REST_URL: ".igem.org/wiki/index.php?title=Team:",
	TEMPLATE_URL: ".igem.org/wiki/index.php?title=Template:",
	ACTION_EDIT: "&action=edit",
	TEXT_BOX_GETTER: "#wpTextbox1",
	SAVE_BUTTON_GETTER: "#wpSave"
}