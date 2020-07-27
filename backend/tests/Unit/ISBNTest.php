<?php

namespace Tests\Unit;

use App\Rules\ISBN;
use PHPUnit\Framework\TestCase;

class ISBNTest extends TestCase {
    private $rule;

    protected function setUp(): void {
        parent::setUp();
        $this->rule = new ISBN();
    }

    /**
     * Test ISBN conversion for a single case.
     *
     * @param string $isbn10
     * @param string $isbn13
     */
    private function assertISBNConversionSingle($isbn10, $isbn13) {
        $this->assertEquals($isbn10, isbn10_from_isbn13($isbn13));
        $this->assertEquals($isbn13, isbn13_from_isbn10($isbn10));
    }

    /**
     * Tests wether ISBN13 can be converted correctly to ISBN10 and vice versa.
     */
    public function testISBNConversion() {
        $this->assertNull(isbn10_from_isbn13(''));
        $this->assertISBNConversionSingle('0545010225', '9780545010221');
        $this->assertNull(isbn10_from_isbn13('1230545010229'));
        $this->assertISBNConversionSingle('0545582997', '9780545582995');
        $this->assertISBNConversionSingle('0545582970', '9780545582971');
        $this->assertISBNConversionSingle('0545582954', '9780545582957');
        $this->assertISBNConversionSingle('0545582938', '9780545582933');
        $this->assertISBNConversionSingle('0345391802', '9780345391803');
        $this->assertISBNConversionSingle('155404295X', '9781554042951'); // source: https://stackoverflow.com/questions/35168817/which-data-type-should-be-used-for-isbn10-and-isbn13
    }

    /**
     * Tests wether ISBN10 validation works.
     */
    public function testISBN10Validation() {
        $this->assertTrue($this->rule->passes('test', '9780545010221'));
        $this->assertTrue($this->rule->passes('test', '9780545582957'));
        $this->assertTrue($this->rule->passes('test', '9780452284234'));
        $this->assertFalse($this->rule->passes('test', '978052284234'));
        $this->assertFalse($this->rule->passes('test', '978X545582957'));
        $this->assertEquals('validation.isbn_invalid_chars', $this->rule->messageUntranslated());
        $this->assertFalse($this->rule->passes('test', '978054501022X'));
        $this->assertEquals('validation.isbn_invalid_chars', $this->rule->messageUntranslated());
        $this->assertFalse($this->rule->passes('test', '9780452284235'));
        $this->assertEquals('validation.isbn13_invalid', $this->rule->messageUntranslated());
        $this->assertTrue($this->rule->passes('test', '155404295X'));
        $this->assertFalse($this->rule->passes('test', '1554042950'));
        $this->assertFalse($this->rule->passes('test', '155404295_'));
        $this->assertFalse($this->rule->passes('test', '155404295X1'));
        $this->assertEquals('validation.isbn_invalid_length', $this->rule->messageUntranslated());
        $this->assertTrue($this->rule->passes('test', '0545582970'));
        $this->assertTrue($this->rule->passes('test', '0545010225'));
        $this->assertFalse($this->rule->passes('test', '0545010226'));
        $this->assertEquals('validation.isbn10_invalid', $this->rule->messageUntranslated());
    }
}
