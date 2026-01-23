function classes(...values: Array<string | undefined>): string {
    return values.filter(Boolean).join(' ');
}

export default classes;
