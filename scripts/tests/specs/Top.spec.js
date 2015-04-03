describe("Top library", function() {
	var _t = Top;

	beforeAll(function () {
		this.Top = Top;
		this._vars = Top._vars;

	});

	describe("Spawning root hierarchy", function() {
		it("Sets up the initial roots", function() {
			expect( RootOf(_v._Base_root) )             .toBe( null );
				expect( RootOf(_v.Stash_root) )           .toBe( (_v._Base_root );
				expect( RootOf(_v._Top_root) )            .toBe( (_v._Base_root );
					expect( RootOf(_v._Peel_root) )         .toBe( (_v._Top_root );
					expect( RootOf(_v._Inner_root) )        .toBe( (_v._Top_root );
						expect( RootOf(_v._Super_root) )      .toBe( (_v._Inner_root );
						expect( RootOf(_v._Pulp_root) )       .toBe( (_v._Inner_root );
							expect( RootOf(_v.Primordial_root) ).toBe( (_v._Pulp_root );
								expect( RootOf(_v.Nothing_root) ) .toBe( (_v.Primordial_root );
								expect( RootOf(_v.Thing_root) )   .toBe( (_v.Primordial_root );
									expect( RootOf(_v.Type_root) )  .toBe( (_v.Thing_root );
		});
	});

	describe("Defines constructs for testing the core types", function() {
		describe("_Thing", function() {
			it("differentiates things from non-things", function () {
				expect( Type_root instanceof _Thing ) .toBe( true );
				expect( {} instanceof _Thing )        .toBe( false );
				expect( NewStash() instanceof _Thing ).toBe( false );
				expect( 123 instanceof _Thing )       .toBe( false );
				expect( "Hello" instanceof _Thing )   .toBe( false );
				expect( null instanceof _Thing )      .toBe( false );
			});

			it("throws an error if executed", function () {
				expect( _Thing() ).toThrowError(TopError);
			});

			it("throws an error executed with 'new'", function () {
				expect(function () {
					new _Thing();
				}).toThrowError(TopError);
			});
		});
});
