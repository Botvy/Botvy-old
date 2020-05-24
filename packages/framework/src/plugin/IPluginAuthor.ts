/**
 * Defines the basic structure for a plugin author
 */
export interface IPluginAuthor {
    /**
     * The full name of the author
     */
    name: string;

    /**
     * The website of the author
     *
     * This field is optional
     */
    website?: string;

    /**
     * The email address of the author
     *
     * This field is optional
     */
    email?: string;
}
